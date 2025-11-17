import { Invoice } from './invoice.entity';
export declare enum BillingItemType {
    TREATMENT = "treatment",
    PROCEDURE = "procedure"
}
export declare class BillingItem {
    id: number;
    invoice: Invoice;
    invoiceId: number;
    description: string;
    type: BillingItemType;
    quantity: number;
    unitPrice: number;
    total: number;
    createdAt: Date;
}
