import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Stripe from 'stripe';
import { Payment, PaymentStatus } from './payment.entity';
import { Invoice, InvoiceStatus } from '../billing/invoice.entity';
import { BillingService } from '../billing/billing.service';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Injectable()
export class PaymentService {
  private stripe: Stripe;

  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    @InjectRepository(Invoice)
    private invoiceRepository: Repository<Invoice>,
    private billingService: BillingService,
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');
  }

  async createPaymentIntent(
    createPaymentDto: CreatePaymentDto,
  ): Promise<Payment> {
    const { invoiceId, amount, currency = 'usd' } = createPaymentDto;

    // Verify invoice exists and is not already paid
    const invoice = await this.billingService.findOneInvoice(invoiceId);
    if (invoice.status === InvoiceStatus.PAID) {
      throw new BadRequestException('Invoice is already paid');
    }

    // Check if amount matches invoice total
    if (parseFloat(invoice.totalAmount.toString()) !== amount) {
      throw new BadRequestException(
        'Payment amount does not match invoice total',
      );
    }

    try {
      // Create Stripe payment intent
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Stripe expects amount in cents
        currency,
        metadata: {
          invoiceId: invoiceId.toString(),
        },
      });

      // Create payment record
      const payment = this.paymentRepository.create({
        invoiceId,
        stripePaymentIntentId: paymentIntent.id,
        amount,
        currency,
        status: PaymentStatus.PENDING,
        stripeClientSecret: paymentIntent.client_secret || undefined,
      });

      return this.paymentRepository.save(payment);
    } catch (error) {
      throw new BadRequestException('Failed to create payment intent');
    }
  }

  async findAll(status?: PaymentStatus): Promise<Payment[]> {
    const where = status ? { status } : {};
    return this.paymentRepository.find({
      where,
      relations: ['invoice', 'invoice.patient'],
      order: { createdAt: 'DESC' },
    });
  }

  async findPaymentById(id: number): Promise<Payment> {
    const payment = await this.paymentRepository.findOne({
      where: { id },
      relations: ['invoice', 'invoice.patient'],
    });
    if (!payment) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }
    return payment;
  }

  async findPaymentsByInvoice(invoiceId: number): Promise<Payment[]> {
    return this.paymentRepository.find({
      where: { invoiceId },
      relations: ['invoice', 'invoice.patient'],
    });
  }

  async handleWebhook(rawBody: Buffer, signature: string): Promise<void> {
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!endpointSecret) {
      throw new BadRequestException('Stripe webhook secret not configured');
    }

    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(
        rawBody,
        signature,
        endpointSecret,
      );
    } catch (err) {
      throw new BadRequestException('Webhook signature verification failed');
    }

    switch (event.type) {
      case 'payment_intent.succeeded':
        await this.handlePaymentSucceeded(event.data.object);
        break;
      case 'payment_intent.payment_failed':
        await this.handlePaymentFailed(event.data.object);
        break;
      default:
        // Ignore other event types
        break;
    }
  }

  private async handlePaymentSucceeded(
    paymentIntent: Stripe.PaymentIntent,
  ): Promise<void> {
    const payment = await this.paymentRepository.findOne({
      where: { stripePaymentIntentId: paymentIntent.id },
      relations: ['invoice'],
    });

    if (!payment) {
      throw new NotFoundException('Payment not found for payment intent');
    }

    // Update payment status
    payment.status = PaymentStatus.SUCCEEDED;
    await this.paymentRepository.save(payment);

    // Update invoice status
    await this.invoiceRepository.update(payment.invoiceId, {
      status: InvoiceStatus.PAID,
    });
  }

  private async handlePaymentFailed(
    paymentIntent: Stripe.PaymentIntent,
  ): Promise<void> {
    const payment = await this.paymentRepository.findOne({
      where: { stripePaymentIntentId: paymentIntent.id },
    });

    if (payment) {
      payment.status = PaymentStatus.FAILED;
      await this.paymentRepository.save(payment);
    }
  }
}
