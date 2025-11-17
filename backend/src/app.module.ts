import { Module, ValidationPipe } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_PIPE } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { databaseConfig } from './config/database.config';
import { AuthModule } from './modules/auth/auth.module';
import { PatientModule } from './modules/patients/patient.module';
import { AppointmentModule } from './modules/appointments/appointment.module';
import { BillingModule } from './modules/billing/billing.module';
import { PaymentModule } from './modules/payments/payment.module';

@Module({
  imports: [TypeOrmModule.forRoot(databaseConfig), AuthModule, PatientModule, AppointmentModule, BillingModule, PaymentModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {}
