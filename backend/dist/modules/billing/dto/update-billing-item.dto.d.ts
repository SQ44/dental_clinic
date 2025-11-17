import { BillingItemType } from '../billing-item.entity';
export declare class UpdateBillingItemDto {
    description?: string;
    type?: BillingItemType;
    quantity?: number;
    unitPrice?: number;
}
