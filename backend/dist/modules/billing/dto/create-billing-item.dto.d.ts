import { BillingItemType } from '../billing-item.entity';
export declare class CreateBillingItemDto {
    invoiceId: number;
    description: string;
    type: BillingItemType;
    quantity?: number;
    unitPrice: number;
}
