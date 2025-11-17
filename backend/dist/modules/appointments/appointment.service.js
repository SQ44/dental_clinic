"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const appointment_entity_1 = require("./appointment.entity");
const patient_entity_1 = require("../patients/patient.entity");
const dentist_entity_1 = require("./dentist.entity");
let AppointmentService = class AppointmentService {
    appointmentRepository;
    patientRepository;
    dentistRepository;
    constructor(appointmentRepository, patientRepository, dentistRepository) {
        this.appointmentRepository = appointmentRepository;
        this.patientRepository = patientRepository;
        this.dentistRepository = dentistRepository;
    }
    async create(createAppointmentDto) {
        const { patientId, dentistId, ...appointmentData } = createAppointmentDto;
        const patient = await this.patientRepository.findOne({ where: { id: patientId } });
        if (!patient) {
            throw new common_1.NotFoundException(`Patient with ID ${patientId} not found`);
        }
        const dentist = await this.dentistRepository.findOne({ where: { id: dentistId } });
        if (!dentist) {
            throw new common_1.NotFoundException(`Dentist with ID ${dentistId} not found`);
        }
        const appointment = this.appointmentRepository.create({
            ...appointmentData,
            patient,
            dentist,
            appointmentDate: new Date(createAppointmentDto.appointmentDate),
        });
        return this.appointmentRepository.save(appointment);
    }
    async findAll() {
        return this.appointmentRepository.find({
            relations: ['patient', 'dentist'],
        });
    }
    async findOne(id) {
        const appointment = await this.appointmentRepository.findOne({
            where: { id },
            relations: ['patient', 'dentist'],
        });
        if (!appointment) {
            throw new common_1.NotFoundException(`Appointment with ID ${id} not found`);
        }
        return appointment;
    }
    async update(id, updateAppointmentDto) {
        const appointment = await this.findOne(id);
        if (updateAppointmentDto.patientId) {
            const patient = await this.patientRepository.findOne({ where: { id: updateAppointmentDto.patientId } });
            if (!patient) {
                throw new common_1.NotFoundException(`Patient with ID ${updateAppointmentDto.patientId} not found`);
            }
            appointment.patient = patient;
            appointment.patientId = updateAppointmentDto.patientId;
        }
        if (updateAppointmentDto.dentistId) {
            const dentist = await this.dentistRepository.findOne({ where: { id: updateAppointmentDto.dentistId } });
            if (!dentist) {
                throw new common_1.NotFoundException(`Dentist with ID ${updateAppointmentDto.dentistId} not found`);
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
    async remove(id) {
        const appointment = await this.findOne(id);
        await this.appointmentRepository.remove(appointment);
    }
};
exports.AppointmentService = AppointmentService;
exports.AppointmentService = AppointmentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(appointment_entity_1.Appointment)),
    __param(1, (0, typeorm_1.InjectRepository)(patient_entity_1.Patient)),
    __param(2, (0, typeorm_1.InjectRepository)(dentist_entity_1.Dentist)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], AppointmentService);
//# sourceMappingURL=appointment.service.js.map