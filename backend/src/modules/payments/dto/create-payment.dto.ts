import { IsNumber, IsString, IsOptional } from 'class-validator';

export class CreatePaymentDto {
  @IsNumber()
  invoiceId: number;

  @IsNumber()
  amount: number;

  @IsString()
  @IsOptional()
  currency?: string = 'usd';
}