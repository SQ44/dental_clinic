'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { appointmentsApi, patientsApi, dentistsApi } from '@/lib/api';
import { Patient, Dentist, CreateAppointmentDto, UpdateAppointmentDto, Appointment, AppointmentStatus } from '@/types';

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

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="patientId" className="block text-sm font-medium text-gray-700">
            Patient *
          </label>
          <select
            id="patientId"
            name="patientId"
            required
            value={formData.patientId}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value={0}>Select a patient</option>
            {patients.map((patient) => (
              <option key={patient.id} value={patient.id}>
                {patient.firstName} {patient.lastName} - {patient.email}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="dentistId" className="block text-sm font-medium text-gray-700">
            Dentist *
          </label>
          <select
            id="dentistId"
            name="dentistId"
            required
            value={formData.dentistId}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value={0}>Select a dentist</option>
            {dentists.map((dentist) => (
              <option key={dentist.id} value={dentist.id}>
                Dr. {dentist.firstName} {dentist.lastName} - {dentist.specialty}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="appointmentDate" className="block text-sm font-medium text-gray-700">
            Appointment Date & Time *
          </label>
          <input
            type="datetime-local"
            id="appointmentDate"
            name="appointmentDate"
            required
            value={formData.appointmentDate}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="durationMinutes" className="block text-sm font-medium text-gray-700">
            Duration (minutes)
          </label>
          <input
            type="number"
            id="durationMinutes"
            name="durationMinutes"
            min="1"
            value={formData.durationMinutes}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value={AppointmentStatus.SCHEDULED}>Scheduled</option>
            <option value={AppointmentStatus.COMPLETED}>Completed</option>
            <option value={AppointmentStatus.CANCELLED}>Cancelled</option>
          </select>
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
            Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={4}
            value={formData.notes}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Additional notes about the appointment..."
          />
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50"
          >
            {loading ? 'Saving...' : (isEdit ? 'Update Appointment' : 'Create Appointment')}
          </button>
        </div>
      </form>
    </div>
  );
}