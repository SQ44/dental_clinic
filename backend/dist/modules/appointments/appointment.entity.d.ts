import { Patient } from '../patients/patient.entity';
import { Dentist } from './dentist.entity';
export declare enum AppointmentStatus {
    SCHEDULED = "scheduled",
    COMPLETED = "completed",
    CANCELLED = "cancelled"
}
export declare class Appointment {
    id: number;
    patient: Patient;
    patientId: number;
    dentist: Dentist;
    dentistId: number;
    appointmentDate: Date;
    durationMinutes: number;
    status: AppointmentStatus;
    notes: string;
    createdAt: Date;
    updatedAt: Date;
}
