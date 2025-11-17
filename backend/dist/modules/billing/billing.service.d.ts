import { Repository } from 'typeorm';
import { Invoice } from './invoice.entity';
import { BillingItem } from './billing-item.entity';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { CreateBillingItemDto } from './dto/create-billing-item.dto';
import { UpdateBillingItemDto } from './dto/update-billing-item.dto';
export declare class BillingService {
    private invoiceRepository;
    private billingItemRepository;
    constructor(invoiceRepository: Repository<Invoice>, billingItemRepository: Repository<BillingItem>);
    createInvoice(createInvoiceDto: CreateInvoiceDto): Promise<Invoice>;
    findAllInvoices(): Promise<Invoice[]>;
    findOneInvoice(id: number): Promise<Invoice>;
    updateInvoice(id: number, updateInvoiceDto: UpdateInvoiceDto): Promise<Invoice>;
    removeInvoice(id: number): Promise<void>;
    createBillingItem(createBillingItemDto: CreateBillingItemDto): Promise<BillingItem>;
    findBillingItemsByInvoice(invoiceId: number): Promise<BillingItem[]>;
    findOneBillingItem(id: number): Promise<BillingItem>;
    updateBillingItem(id: number, updateBillingItemDto: UpdateBillingItemDto): Promise<BillingItem>;
    removeBillingItem(id: number): Promise<void>;
    private updateInvoiceTotal;
}
