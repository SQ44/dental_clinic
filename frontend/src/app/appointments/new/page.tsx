'use client';

import Link from 'next/link';
import AppointmentForm from '@/components/appointments/AppointmentForm';

export default function NewAppointmentPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/appointments" className="text-blue-600 hover:text-blue-800">
                ← Back to Appointments
              </Link>
            </div>
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">New Appointment</h1>
            </div>
            <div className="flex items-center">
              {/* Empty div for flex balance */}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <AppointmentForm />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}