'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { appointmentsApi } from '@/lib/api';
import { Appointment } from '@/types';
import AppointmentForm from '@/components/appointments/AppointmentForm';
import FormPageLayout from '@/components/FormPageLayout';

export default function EditAppointmentPage() {
  const params = useParams();
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const id = params.id as string;

  useEffect(() => {
    if (id) {
      fetchAppointment();
    }
  }, [id]);

  const fetchAppointment = async () => {
    try {
      const data = await appointmentsApi.getById(parseInt(id));
      setAppointment(data);
    } catch (err) {
      setError('Failed to load appointment');
    } finally {
      setLoading(false);
    }
  };

  const backHref = appointment ? `/appointments/${appointment.id}` : '/appointments';

  return (
    <FormPageLayout
      title={appointment ? 'Edit Appointment' : 'Edit Appointment'}
      description="Adjust the schedule, assign providers, or update the visit status."
      badge="Appointments"
      backHref={backHref}
      backLabel={appointment ? 'Appointment' : 'Appointments'}
    >
      {loading ? (
        <div className="flex flex-col items-center justify-center py-12 text-sm text-gray-500">
          <div className="mb-3 h-10 w-10 animate-spin rounded-full border-b-2 border-indigo-500"></div>
          Loading appointment...
        </div>
      ) : error || !appointment ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-6 text-center text-sm text-amber-700">
          {error || 'Appointment not found. Please return to the appointment list.'}
        </div>
      ) : (
        <AppointmentForm appointment={appointment} isEdit={true} />
      )}
    </FormPageLayout>
  );
}
