export interface Patient {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  address?: string;
  medicalHistory?: string;
  createdAt: string;
  updatedAt: string;
}
export interface CreatePatientDto {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  address?: string;
  medicalHistory?: string;
}
// kuy
export interface UpdatePatientDto extends Partial<CreatePatientDto> {}

export interface LoginCredentials {
  email: string;
  password: string;
}
// dfkdfdk
export interface AuthResponse {
  access_token: string;
}

export interface User {
  id: number;
  email: string;
  role: string;
}

export interface Dentist {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  specialty?: string;
  licenseNumber?: string;
  createdAt: string;
}

export enum AppointmentStatus {
  SCHEDULED = 'scheduled',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export interface Appointment {
  id: number;
  patient: Patient;
  patientId: number;
  dentist: Dentist;
  dentistId: number;
  appointmentDate: string;
  durationMinutes: number;
  status: AppointmentStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAppointmentDto {
  patientId: number;
  dentistId: number;
  appointmentDate: string;
  durationMinutes?: number;
  status?: AppointmentStatus;
  notes?: string;
}

export interface UpdateAppointmentDto extends Partial<CreateAppointmentDto> {}

export enum InvoiceStatus {
  PENDING = 'pending',
  PAID = 'paid',
  OVERDUE = 'overdue',
}

export enum BillingItemType {
  TREATMENT = 'treatment',
  PROCEDURE = 'procedure',
}

export interface BillingItem {
  id: number;
  invoiceId: number;
  description: string;
  type: BillingItemType;
  quantity: number;
  unitPrice: number;
  total: number;
  createdAt: string;
}

export interface Invoice {
  id: number;
  patient: Patient;
  patientId: number;
  appointment: Appointment;
  appointmentId: number;
  totalAmount: number;
  status: InvoiceStatus;
  dueDate?: string;
  billingItems: BillingItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateInvoiceDto {
  patientId: number;
  appointmentId: number;
  status?: InvoiceStatus;
  dueDate?: string;
}

export interface UpdateInvoiceDto {
  status?: InvoiceStatus;
  dueDate?: string;
}

export interface CreateBillingItemDto {
  invoiceId: number;
  description: string;
  type: BillingItemType;
  quantity?: number;
  unitPrice: number;
}

export interface UpdateBillingItemDto {
  description?: string;
  type?: BillingItemType;
  quantity?: number;
  unitPrice?: number;
}

export enum PaymentStatus {
  PENDING = 'pending',
  SUCCEEDED = 'succeeded',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

export interface Payment {
  id: number;
  invoice: Invoice;
  invoiceId: number;
  stripePaymentIntentId: string;
  amount: number;
  status: PaymentStatus;
  currency: string;
  stripeClientSecret?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePaymentDto {
  invoiceId: number;
  amount: number;
  currency?: string;
}