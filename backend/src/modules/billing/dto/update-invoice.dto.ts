import { IsOptional, IsDateString, IsEnum } from 'class-validator';
import { InvoiceStatus } from '../invoice.entity';

export class UpdateInvoiceDto {
  @IsOptional()
  @IsEnum(InvoiceStatus)
  status?: InvoiceStatus;

  @IsOptional()
  @IsDateString()
  dueDate?: string;
}