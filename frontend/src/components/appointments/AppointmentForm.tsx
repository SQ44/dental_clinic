'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { appointmentsApi, patientsApi, dentistsApi } from '@/lib/api';
import { Patient, Dentist, CreateAppointmentDto, UpdateAppointmentDto, Appointment, AppointmentStatus } from '@/types';
import { formControlClasses, formHintClasses, formLabelClasses } from '@/lib/formStyles';

interface AppointmentFormProps {
  appointment?: Appointment;
  isEdit?: boolean;
}

export default function AppointmentForm({ appointment, isEdit = false }: AppointmentFormProps) {
  const router = useRouter();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [dentists, setDentists] = useState<Dentist[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState<CreateAppointmentDto>({
    patientId: appointment?.patientId || 0,
    dentistId: appointment?.dentistId || 0,
    appointmentDate: appointment ? new Date(appointment.appointmentDate).toISOString().slice(0, 16) : '',
    durationMinutes: appointment?.durationMinutes || 30,
    status: appointment?.status || AppointmentStatus.SCHEDULED,
    notes: appointment?.notes || '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [patientsData, dentistsData] = await Promise.all([
        patientsApi.getAll(),
        dentistsApi.getAll(),
      ]);
      setPatients(patientsData);
      setDentists(dentistsData);
    } catch (err) {
      setError('Failed to load data');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const dataToSubmit = {
        ...formData,
        appointmentDate: new Date(formData.appointmentDate).toISOString(),
      };

      if (isEdit && appointment) {
        await appointmentsApi.update(appointment.id, dataToSubmit as UpdateAppointmentDto);
      } else {
        await appointmentsApi.create(dataToSubmit);
      }

      router.push('/appointments');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save appointment');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'patientId' || name === 'dentistId' || name === 'durationMinutes'
        ? parseInt(value) || 0
        : value,
    }));
  };

  const inputClassName = `${formControlClasses}`;

  return (
    <div className="mx-auto w-full">
      <form onSubmit={handleSubmit} className="space-y-8">
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <section className="space-y-4 rounded-2xl border border-gray-100 bg-slate-50/40 p-6">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Participants</h3>
            <p className="text-sm text-slate-500">Assign the right patient and clinical team.</p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="patientId" className={formLabelClasses}>
                Patient *
              </label>
              <p className={formHintClasses}>Select the patient who will attend this appointment.</p>
              <select
                id="patientId"
                name="patientId"
                required
                value={formData.patientId}
                onChange={handleChange}
                className={`${inputClassName} mt-2`}
              >
                <option value={0}>Select a patient</option>
                {patients.map((patient) => (
                  <option key={patient.id} value={patient.id}>
                    {patient.firstName} {patient.lastName} — {patient.email}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="dentistId" className={formLabelClasses}>
                Dentist *
              </label>
              <p className={formHintClasses}>Choose the provider responsible for this visit.</p>
              <select
                id="dentistId"
                name="dentistId"
                required
                value={formData.dentistId}
                onChange={handleChange}
                className={`${inputClassName} mt-2`}
              >
                <option value={0}>Select a dentist</option>
                {dentists.map((dentist) => (
                  <option key={dentist.id} value={dentist.id}>
                    Dr. {dentist.firstName} {dentist.lastName} — {dentist.specialty}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        <section className="space-y-4 rounded-2xl border border-gray-100 bg-slate-50/40 p-6">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Scheduling</h3>
            <p className="text-sm text-slate-500">Set when the appointment happens and how long it lasts.</p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="appointmentDate" className={formLabelClasses}>
                Appointment Date &amp; Time *
              </label>
              <input
                type="datetime-local"
                id="appointmentDate"
                name="appointmentDate"
                required
                value={formData.appointmentDate}
                onChange={handleChange}
                className={`${inputClassName} mt-2`}
              />
            </div>

            <div>
              <label htmlFor="durationMinutes" className={formLabelClasses}>
                Duration (minutes)
              </label>
              <p className={formHintClasses}>Default is 30 minutes—adjust as needed.</p>
              <input
                type="number"
                id="durationMinutes"
                name="durationMinutes"
                min="1"
                value={formData.durationMinutes}
                onChange={handleChange}
                className={`${inputClassName} mt-2`}
              />
            </div>
          </div>
        </section>

        <section className="space-y-4 rounded-2xl border border-gray-100 bg-slate-50/40 p-6">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Status &amp; Notes</h3>
            <p className="text-sm text-slate-500">Track progress and capture any prep information.</p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="md:col-span-1">
              <label htmlFor="status" className={formLabelClasses}>
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className={`${inputClassName} mt-2`}
              >
                <option value={AppointmentStatus.SCHEDULED}>Scheduled</option>
                <option value={AppointmentStatus.COMPLETED}>Completed</option>
                <option value={AppointmentStatus.CANCELLED}>Cancelled</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label htmlFor="notes" className={formLabelClasses}>
                Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={4}
                value={formData.notes}
                onChange={handleChange}
                className={`${inputClassName} mt-2`}
                placeholder="Add prep instructions, medical notes, or visit goals..."
              />
            </div>
          </div>
        </section>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center justify-center rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:opacity-60"
          >
            {loading ? 'Saving...' : (isEdit ? 'Update Appointment' : 'Create Appointment')}
          </button>
        </div>
      </form>
    </div>
  );
}
