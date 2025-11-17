import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from './appointment.entity';
import { Patient } from '../patients/patient.entity';
import { Dentist } from './dentist.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
    @InjectRepository(Patient)
    private patientRepository: Repository<Patient>,
    @InjectRepository(Dentist)
    private dentistRepository: Repository<Dentist>,
  ) {}

  async create(createAppointmentDto: CreateAppointmentDto): Promise<Appointment> {
    const { patientId, dentistId, ...appointmentData } = createAppointmentDto;

    const patient = await this.patientRepository.findOne({ where: { id: patientId } });
    if (!patient) {
      throw new NotFoundException(`Patient with ID ${patientId} not found`);
    }

    const dentist = await this.dentistRepository.findOne({ where: { id: dentistId } });
    if (!dentist) {
      throw new NotFoundException(`Dentist with ID ${dentistId} not found`);
    }

    const appointment = this.appointmentRepository.create({
      ...appointmentData,
      patient,
      dentist,
      appointmentDate: new Date(createAppointmentDto.appointmentDate),
    });

    return this.appointmentRepository.save(appointment);
  }

  async findAll(): Promise<Appointment[]> {
    return this.appointmentRepository.find({
      relations: ['patient', 'dentist'],
    });
  }

  async findOne(id: number): Promise<Appointment> {
    const appointment = await this.appointmentRepository.findOne({
      where: { id },
      relations: ['patient', 'dentist'],
    });
    if (!appointment) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }
    return appointment;
  }

  async update(id: number, updateAppointmentDto: UpdateAppointmentDto): Promise<Appointment> {
    const appointment = await this.findOne(id);

    if (updateAppointmentDto.patientId) {
      const patient = await this.patientRepository.findOne({ where: { id: updateAppointmentDto.patientId } });
      if (!patient) {
        throw new NotFoundException(`Patient with ID ${updateAppointmentDto.patientId} not found`);
      }
      appointment.patient = patient;
      appointment.patientId = updateAppointmentDto.patientId;
    }

    if (updateAppointmentDto.dentistId) {
      const dentist = await this.dentistRepository.findOne({ where: { id: updateAppointmentDto.dentistId } });
      if (!dentist) {
        throw new NotFoundException(`Dentist with ID ${updateAppointmentDto.dentistId} not found`);
      }
      appointment.dentist = dentist;
      appointment.dentistId = updateAppointmentDto.dentistId;
    }

    if (updateAppointmentDto.appointmentDate) {
      appointment.appointmentDate = new Date(updateAppointmentDto.appointmentDate);
    }

    Object.assign(appointment, updateAppointmentDto);
    return this.appointmentRepository.save(appointment);
  }

  async remove(id: number): Promise<void> {
    const appointment = await this.findOne(id);
    await this.appointmentRepository.remove(appointment);
  }
}