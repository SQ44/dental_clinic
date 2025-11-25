import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BillingService } from './billing.service';
import { BillingController } from './billing.controller';
import { Invoice } from './invoice.entity';
import { BillingItem } from './billing-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Invoice, BillingItem])],
  controllers: [BillingController],
  providers: [BillingService],
  exports: [BillingService],
})
export class BillingModule {}
