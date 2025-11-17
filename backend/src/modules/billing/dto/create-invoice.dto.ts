import { IsNotEmpty, IsNumber, IsOptional, IsDateString, IsEnum } from 'class-validator';
import { InvoiceStatus } from '../invoice.entity';

export class CreateInvoiceDto {
  @IsNotEmpty()
  @IsNumber()
  patientId: number;

  @IsNotEmpty()
  @IsNumber()
  appointmentId: number;

  @IsOptional()
  @IsEnum(InvoiceStatus)
  status?: InvoiceStatus;

  @IsOptional()
  @IsDateString()
  dueDate?: string;
}