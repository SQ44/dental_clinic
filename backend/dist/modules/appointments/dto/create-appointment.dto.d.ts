import { AppointmentStatus } from '../appointment.entity';
export declare class CreateAppointmentDto {
    patientId: number;
    dentistId: number;
    appointmentDate: string;
    durationMinutes?: number;
    status?: AppointmentStatus;
    notes?: string;
}
