'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { billingApi, patientsApi, appointmentsApi } from '@/lib/api';
import { CreateInvoiceDto, Patient, Appointment, InvoiceStatus } from '@/types';
import Link from 'next/link';
import FormPageLayout from '@/components/FormPageLayout';
import { formControlClasses, formHintClasses, formLabelClasses } from '@/lib/formStyles';

export default function NewInvoicePage() {
  const router = useRouter();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<CreateInvoiceDto>({
    patientId: 0,
    appointmentId: 0,
    status: InvoiceStatus.PENDING,
    dueDate: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setDataLoading(true);
      const [patientsData, appointmentsData] = await Promise.all([
        patientsApi.getAll(),
        appointmentsApi.getAll(),
      ]);
      setPatients(patientsData);
      setAppointments(appointmentsData);
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setDataLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await billingApi.createInvoice(formData);
      router.push('/billing');
    } catch (err) {
      setError('Failed to create invoice');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'patientId' || name === 'appointmentId' ? parseInt(value) : value,
    }));
  };

  const inputClassName = `${formControlClasses}`;

  return (
    <FormPageLayout
      title="Create New Invoice"
      description="Associate the invoice with a patient, link an appointment, and define the payment timeline."
      badge="Billing"
      backHref="/billing"
      backLabel="Billing"
    >
      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {dataLoading ? (
        <div className="flex flex-col items-center justify-center py-12 text-sm text-gray-500">
          <div className="mb-3 h-10 w-10 animate-spin rounded-full border-b-2 border-indigo-500"></div>
          Preparing patient and appointment lists...
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8">
          <section className="space-y-4 rounded-2xl border border-gray-100 bg-slate-50/40 p-6">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Associations</h2>
              <p className="text-sm text-slate-500">Link the invoice to the right patient and appointment.</p>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label htmlFor="patientId" className={formLabelClasses}>
                  Patient *
                </label>
                <p className={formHintClasses}>Select who will receive this invoice.</p>
                <select
                  id="patientId"
                  name="patientId"
                  required
                  value={formData.patientId || ''}
                  onChange={handleChange}
                  className={`${inputClassName} mt-2`}
                >
                  <option value="">Select a patient</option>
                  {patients.map((patient) => (
                    <option key={patient.id} value={patient.id}>
                      {patient.firstName} {patient.lastName} — {patient.email}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="appointmentId" className={formLabelClasses}>
                  Appointment *
                </label>
                <p className={formHintClasses}>Connect this invoice to a specific visit.</p>
                <select
                  id="appointmentId"
                  name="appointmentId"
                  required
                  value={formData.appointmentId || ''}
                  onChange={handleChange}
                  className={`${inputClassName} mt-2`}
                >
                  <option value="">Select an appointment</option>
                  {appointments.map((appointment) => (
                    <option key={appointment.id} value={appointment.id}>
                      #{appointment.id} — {appointment.patient.firstName} {appointment.patient.lastName} (
                      {new Date(appointment.appointmentDate).toLocaleDateString()})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          <section className="space-y-4 rounded-2xl border border-gray-100 bg-slate-50/40 p-6">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Payment Terms</h2>
              <p className="text-sm text-slate-500">Optional due date to keep receivables organized.</p>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label htmlFor="status" className={formLabelClasses}>
                  Status
                </label>
                <p className={formHintClasses}>Defaults to pending but can be overridden.</p>
                <select
                  id="status"
                  name="status"
                  value={formData.status || ''}
                  onChange={handleChange}
                  className={`${inputClassName} mt-2`}
                >
                  <option value="">Select status</option>
                  <option value={InvoiceStatus.PENDING}>{InvoiceStatus.PENDING}</option>
                  <option value={InvoiceStatus.PAID}>{InvoiceStatus.PAID}</option>
                  <option value={InvoiceStatus.OVERDUE}>{InvoiceStatus.OVERDUE}</option>
                </select>
              </div>

              <div>
                <label htmlFor="dueDate" className={formLabelClasses}>
                  Due Date
                </label>
                <p className={formHintClasses}>We’ll surface reminders as the due date approaches.</p>
                <input
                  type="date"
                  id="dueDate"
                  name="dueDate"
                  value={formData.dueDate || ''}
                  onChange={handleChange}
                  className={`${inputClassName} mt-2`}
                />
              </div>
            </div>
          </section>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Link
              href="/billing"
              className="inline-flex items-center justify-center rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:opacity-60"
            >
              {loading ? 'Creating...' : 'Create Invoice'}
            </button>
          </div>
        </form>
      )}
    </FormPageLayout>
  );
}
