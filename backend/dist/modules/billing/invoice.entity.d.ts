import { Patient } from '../patients/patient.entity';
import { Appointment } from '../appointments/appointment.entity';
import { BillingItem } from './billing-item.entity';
export declare enum InvoiceStatus {
    PENDING = "pending",
    PAID = "paid",
    OVERDUE = "overdue"
}
export declare class Invoice {
    id: number;
    patient: Patient;
    patientId: number;
    appointment: Appointment;
    appointmentId: number;
    totalAmount: number;
    status: InvoiceStatus;
    dueDate: Date;
    billingItems: BillingItem[];
    createdAt: Date;
    updatedAt: Date;
}
