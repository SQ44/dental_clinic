import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invoice } from './invoice.entity';
import { BillingItem } from './billing-item.entity';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { CreateBillingItemDto } from './dto/create-billing-item.dto';
import { UpdateBillingItemDto } from './dto/update-billing-item.dto';

@Injectable()
export class BillingService {
  constructor(
    @InjectRepository(Invoice)
    private invoiceRepository: Repository<Invoice>,
    @InjectRepository(BillingItem)
    private billingItemRepository: Repository<BillingItem>,
  ) {}

  async createInvoice(createInvoiceDto: CreateInvoiceDto): Promise<Invoice> {
    const invoice = this.invoiceRepository.create({
      ...createInvoiceDto,
      totalAmount: 0, // Initial total, will be updated when items are added
    });
    return this.invoiceRepository.save(invoice);
  }

  async findAllInvoices(): Promise<Invoice[]> {
    return this.invoiceRepository.find({
      relations: ['patient', 'appointment'],
    });
  }

  async findOneInvoice(id: number): Promise<Invoice> {
    const invoice = await this.invoiceRepository.findOne({
      where: { id },
      relations: ['patient', 'appointment', 'billingItems'],
    });
    if (!invoice) {
      throw new NotFoundException(`Invoice with ID ${id} not found`);
    }
    return invoice;
  }

  async updateInvoice(
    id: number,
    updateInvoiceDto: UpdateInvoiceDto,
  ): Promise<Invoice> {
    const invoice = await this.findOneInvoice(id);
    Object.assign(invoice, updateInvoiceDto);
    return this.invoiceRepository.save(invoice);
  }

  async removeInvoice(id: number): Promise<void> {
    const invoice = await this.findOneInvoice(id);
    await this.invoiceRepository.remove(invoice);
  }

  async createBillingItem(
    createBillingItemDto: CreateBillingItemDto,
  ): Promise<BillingItem> {
    const quantity = createBillingItemDto.quantity ?? 1;
    const total = quantity * createBillingItemDto.unitPrice;
    const billingItem = this.billingItemRepository.create({
      ...createBillingItemDto,
      quantity,
      total,
    });
    const savedItem = await this.billingItemRepository.save(billingItem);
    // Update invoice total
    await this.updateInvoiceTotal(savedItem.invoiceId);
    return savedItem;
  }

  async findBillingItemsByInvoice(invoiceId: number): Promise<BillingItem[]> {
    return this.billingItemRepository.find({
      where: { invoiceId },
    });
  }

  async findOneBillingItem(id: number): Promise<BillingItem> {
    const item = await this.billingItemRepository.findOne({
      where: { id },
      relations: ['invoice'],
    });
    if (!item) {
      throw new NotFoundException(`Billing item with ID ${id} not found`);
    }
    return item;
  }

  async updateBillingItem(
    id: number,
    updateBillingItemDto: UpdateBillingItemDto,
  ): Promise<BillingItem> {
    const item = await this.findOneBillingItem(id);
    Object.assign(item, updateBillingItemDto);
    if (
      updateBillingItemDto.quantity !== undefined ||
      updateBillingItemDto.unitPrice !== undefined
    ) {
      item.total =
        (updateBillingItemDto.quantity ?? item.quantity) *
        (updateBillingItemDto.unitPrice ?? item.unitPrice);
    }
    const savedItem = await this.billingItemRepository.save(item);
    // Update invoice total
    await this.updateInvoiceTotal(savedItem.invoiceId);
    return savedItem;
  }

  async removeBillingItem(id: number): Promise<void> {
    const item = await this.findOneBillingItem(id);
    const invoiceId = item.invoiceId;
    await this.billingItemRepository.remove(item);
    // Update invoice total
    await this.updateInvoiceTotal(invoiceId);
  }

  private async updateInvoiceTotal(invoiceId: number): Promise<void> {
    const items = await this.billingItemRepository.find({
      where: { invoiceId },
      select: ['total'],
    });
    const total = items.reduce(
      (sum, item) => sum + parseFloat(item.total.toString()),
      0,
    );
    await this.invoiceRepository.update(invoiceId, { totalAmount: total });
  }
}
