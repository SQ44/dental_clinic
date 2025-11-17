import { InvoiceStatus } from '../invoice.entity';
export declare class CreateInvoiceDto {
    patientId: number;
    appointmentId: number;
    status?: InvoiceStatus;
    dueDate?: string;
}
