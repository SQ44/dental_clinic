import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsEnum,
  IsOptional,
  Min,
} from 'class-validator';
import { BillingItemType } from '../billing-item.entity';

export class CreateBillingItemDto {
  @IsNotEmpty()
  @IsNumber()
  invoiceId: number;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsEnum(BillingItemType)
  type: BillingItemType;

  @IsOptional()
  @IsNumber()
  @Min(1)
  quantity?: number = 1;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  unitPrice: number;
}
