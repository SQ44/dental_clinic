import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppointmentService } from './appointment.service';
import { AppointmentController } from './appointment.controller';
import { Appointment } from './appointment.entity';
import { Dentist } from './dentist.entity';
import { Patient } from '../patients/patient.entity';
import { DentistService } from './dentist.service';
import { DentistController } from './dentist.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Appointment, Dentist, Patient])],
  controllers: [AppointmentController, DentistController],
  providers: [AppointmentService, DentistService],
  exports: [AppointmentService],
})
export class AppointmentModule {}
