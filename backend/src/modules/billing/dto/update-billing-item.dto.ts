import { IsOptional, IsNumber, IsString, IsEnum, Min } from 'class-validator';
import { BillingItemType } from '../billing-item.entity';

export class UpdateBillingItemDto {
  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(BillingItemType)
  type?: BillingItemType;

  @IsOptional()
  @IsNumber()
  @Min(1)
  quantity?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  unitPrice?: number;
}