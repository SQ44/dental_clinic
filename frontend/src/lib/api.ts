import axios from 'axios';
import Cookies from 'js-cookie';
import { Patient, CreatePatientDto, UpdatePatientDto, LoginCredentials, AuthResponse, Appointment, CreateAppointmentDto, UpdateAppointmentDto, Dentist, Invoice, CreateInvoiceDto, UpdateInvoiceDto, BillingItem, CreateBillingItemDto, UpdateBillingItemDto, Payment, CreatePaymentDto } from '@/types';

// Prefer a relative API path so the frontend uses the reverse proxy (nginx) in
// development and production. If a full URL is needed, set NEXT_PUBLIC_API_URL.
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token
api.interceptors.request.use((config) => {
  const token = Cookies.get('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove('access_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials);
    return response.data;
  },
};

export const patientsApi = {
  getAll: async (): Promise<Patient[]> => {
    const response = await api.get('/patients');
    return response.data;
  },

  getById: async (id: number): Promise<Patient> => {
    const response = await api.get(`/patients/${id}`);
    return response.data;
  },

  create: async (patient: CreatePatientDto): Promise<Patient> => {
    const response = await api.post('/patients', patient);
    return response.data;
  },

  update: async (id: number, patient: UpdatePatientDto): Promise<Patient> => {
    const response = await api.patch(`/patients/${id}`, patient);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/patients/${id}`);
  },
};

export const appointmentsApi = {
  getAll: async (): Promise<Appointment[]> => {
    const response = await api.get('/appointments');
    return response.data;
  },

  getById: async (id: number): Promise<Appointment> => {
    const response = await api.get(`/appointments/${id}`);
    return response.data;
  },

  create: async (appointment: CreateAppointmentDto): Promise<Appointment> => {
    const response = await api.post('/appointments', appointment);
    return response.data;
  },

  update: async (id: number, appointment: UpdateAppointmentDto): Promise<Appointment> => {
    const response = await api.patch(`/appointments/${id}`, appointment);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/appointments/${id}`);
  },
};

// For now, dentists API - assuming they are seeded or managed separately
export const dentistsApi = {
  getAll: async (): Promise<Dentist[]> => {
    // Since there's no dentist controller, we'll mock this for now
    // In a real app, you'd have a dentist endpoint
    return [
      { id: 1, firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', specialty: 'General Dentistry', licenseNumber: '12345', createdAt: new Date().toISOString() },
      { id: 2, firstName: 'Jane', lastName: 'Smith', email: 'jane.smith@example.com', specialty: 'Orthodontics', licenseNumber: '67890', createdAt: new Date().toISOString() },
    ];
  },
};

export const billingApi = {
  // Invoice endpoints
  getAllInvoices: async (): Promise<Invoice[]> => {
    const response = await api.get('/billing/invoices');
    return response.data;
  },

  getInvoiceById: async (id: number): Promise<Invoice> => {
    const response = await api.get(`/billing/invoices/${id}`);
    return response.data;
  },

  createInvoice: async (invoice: CreateInvoiceDto): Promise<Invoice> => {
    const response = await api.post('/billing/invoices', invoice);
    return response.data;
  },

  updateInvoice: async (id: number, invoice: UpdateInvoiceDto): Promise<Invoice> => {
    const response = await api.patch(`/billing/invoices/${id}`, invoice);
    return response.data;
  },

  deleteInvoice: async (id: number): Promise<void> => {
    await api.delete(`/billing/invoices/${id}`);
  },

  // Billing item endpoints
  getBillingItemsByInvoice: async (invoiceId: number): Promise<BillingItem[]> => {
    const response = await api.get(`/billing/invoices/${invoiceId}/items`);
    return response.data;
  },

  createBillingItem: async (invoiceId: number, item: CreateBillingItemDto): Promise<BillingItem> => {
    const response = await api.post(`/billing/invoices/${invoiceId}/items`, item);
    return response.data;
  },

  updateBillingItem: async (id: number, item: UpdateBillingItemDto): Promise<BillingItem> => {
    const response = await api.patch(`/billing/items/${id}`, item);
    return response.data;
  },

  deleteBillingItem: async (id: number): Promise<void> => {
    await api.delete(`/billing/items/${id}`);
  },
};

export const paymentsApi = {
  createPaymentIntent: async (payment: CreatePaymentDto): Promise<Payment> => {
    const response = await api.post('/payments/create-intent', payment);
    return response.data;
  },

  getPaymentById: async (id: number): Promise<Payment> => {
    const response = await api.get(`/payments/${id}`);
    return response.data;
  },

  getPaymentsByInvoice: async (invoiceId: number): Promise<Payment[]> => {
    const response = await api.get(`/payments/invoice/${invoiceId}`);
    return response.data;
  },
};