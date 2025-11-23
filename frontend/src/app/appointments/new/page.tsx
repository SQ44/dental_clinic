'use client';

import AppointmentForm from '@/components/appointments/AppointmentForm';
import FormPageLayout from '@/components/FormPageLayout';

export default function NewAppointmentPage() {
  return (
    <FormPageLayout
      title="Schedule Appointment"
      description="Reserve chair time, assign providers, and capture any pre-visit notes."
      badge="Appointments"
      backHref="/appointments"
      backLabel="Appointments"
    >
      <AppointmentForm />
    </FormPageLayout>
  );
}
