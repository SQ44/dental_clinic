import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe } from '@nestjs/common';
import { BillingService } from './billing.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { CreateBillingItemDto } from './dto/create-billing-item.dto';
import { UpdateBillingItemDto } from './dto/update-billing-item.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('billing')
@UseGuards(JwtAuthGuard)
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  // Invoice endpoints
  @Post('invoices')
  createInvoice(@Body() createInvoiceDto: CreateInvoiceDto) {
    return this.billingService.createInvoice(createInvoiceDto);
  }

  @Get('invoices')
  findAllInvoices() {
    return this.billingService.findAllInvoices();
  }

  @Get('invoices/:id')
  findOneInvoice(@Param('id', ParseIntPipe) id: number) {
    return this.billingService.findOneInvoice(id);
  }

  @Patch('invoices/:id')
  updateInvoice(@Param('id', ParseIntPipe) id: number, @Body() updateInvoiceDto: UpdateInvoiceDto) {
    return this.billingService.updateInvoice(id, updateInvoiceDto);
  }

  @Delete('invoices/:id')
  removeInvoice(@Param('id', ParseIntPipe) id: number) {
    return this.billingService.removeInvoice(id);
  }

  // Billing item endpoints
  @Post('invoices/:invoiceId/items')
  createBillingItem(@Param('invoiceId', ParseIntPipe) invoiceId: number, @Body() createBillingItemDto: CreateBillingItemDto) {
    return this.billingService.createBillingItem({ ...createBillingItemDto, invoiceId });
  }

  @Get('invoices/:invoiceId/items')
  findBillingItemsByInvoice(@Param('invoiceId', ParseIntPipe) invoiceId: number) {
    return this.billingService.findBillingItemsByInvoice(invoiceId);
  }

  @Patch('items/:id')
  updateBillingItem(@Param('id', ParseIntPipe) id: number, @Body() updateBillingItemDto: UpdateBillingItemDto) {
    return this.billingService.updateBillingItem(id, updateBillingItemDto);
  }

  @Delete('items/:id')
  removeBillingItem(@Param('id', ParseIntPipe) id: number) {
    return this.billingService.removeBillingItem(id);
  }
}