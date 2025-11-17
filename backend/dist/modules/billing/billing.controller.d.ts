import { BillingService } from './billing.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { CreateBillingItemDto } from './dto/create-billing-item.dto';
import { UpdateBillingItemDto } from './dto/update-billing-item.dto';
export declare class BillingController {
    private readonly billingService;
    constructor(billingService: BillingService);
    createInvoice(createInvoiceDto: CreateInvoiceDto): Promise<import("./invoice.entity").Invoice>;
    findAllInvoices(): Promise<import("./invoice.entity").Invoice[]>;
    findOneInvoice(id: number): Promise<import("./invoice.entity").Invoice>;
    updateInvoice(id: number, updateInvoiceDto: UpdateInvoiceDto): Promise<import("./invoice.entity").Invoice>;
    removeInvoice(id: number): Promise<void>;
    createBillingItem(invoiceId: number, createBillingItemDto: CreateBillingItemDto): Promise<import("./billing-item.entity").BillingItem>;
    findBillingItemsByInvoice(invoiceId: number): Promise<import("./billing-item.entity").BillingItem[]>;
    updateBillingItem(id: number, updateBillingItemDto: UpdateBillingItemDto): Promise<import("./billing-item.entity").BillingItem>;
    removeBillingItem(id: number): Promise<void>;
}
