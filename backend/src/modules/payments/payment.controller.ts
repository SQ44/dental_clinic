import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  ParseIntPipe,
  Headers,
  BadRequestException,
  UseGuards,
  Query,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PaymentStatus } from './payment.entity';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Query('status') status?: PaymentStatus) {
    return this.paymentService.findAll(status);
  }

  @Post('create-intent')
  @UseGuards(JwtAuthGuard)
  createPaymentIntent(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentService.createPaymentIntent(createPaymentDto);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findPaymentById(@Param('id', ParseIntPipe) id: number) {
    return this.paymentService.findPaymentById(id);
  }

  @Get('invoice/:invoiceId')
  @UseGuards(JwtAuthGuard)
  findPaymentsByInvoice(@Param('invoiceId', ParseIntPipe) invoiceId: number) {
    return this.paymentService.findPaymentsByInvoice(invoiceId);
  }

  @Post('webhook')
  async handleWebhook(
    @Body() rawBody: Buffer,
    @Headers('stripe-signature') signature: string,
  ) {
    if (!signature) {
      throw new BadRequestException('Missing Stripe signature');
    }
    await this.paymentService.handleWebhook(rawBody, signature);
    return { received: true };
  }
}
