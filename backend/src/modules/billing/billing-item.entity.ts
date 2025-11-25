import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Invoice } from './invoice.entity';

export enum BillingItemType {
  TREATMENT = 'treatment',
  PROCEDURE = 'procedure',
}

@Entity('billing_items')
export class BillingItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Invoice, (invoice) => invoice.billingItems, {
    nullable: false,
  })
  @JoinColumn({ name: 'invoice_id' })
  invoice: Invoice;

  @Column({ name: 'invoice_id' })
  invoiceId: number;

  @Column({ length: 255 })
  description: string;

  @Column({
    type: 'enum',
    enum: BillingItemType,
  })
  type: BillingItemType;

  @Column({ type: 'int', default: 1 })
  quantity: number;

  @Column({ name: 'unit_price', type: 'decimal', precision: 10, scale: 2 })
  unitPrice: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
