'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { appointmentsApi } from '@/lib/api';
import { Appointment, AppointmentStatus } from '@/types';
import DashboardShell from '@/components/DashboardShell';

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<AppointmentStatus | 'all'>('all');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const data = await appointmentsApi.getAll();
      setAppointments(data);
    } catch (err) {
      setError('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this appointment?')) return;

    try {
      await appointmentsApi.delete(id);
      setAppointments(appointments.filter(appointment => appointment.id !== id));
    } catch (err) {
      setError('Failed to delete appointment');
    }
  };

  const filteredAppointments = filter === 'all'
    ? appointments
    : appointments.filter(apt => apt.status === filter);

  const getStatusColor = (status: AppointmentStatus) => {
    switch (status) {
      case AppointmentStatus.SCHEDULED:
        return 'bg-blue-100 text-blue-800';
      case AppointmentStatus.COMPLETED:
        return 'bg-green-100 text-green-800';
      case AppointmentStatus.CANCELLED:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <DashboardShell>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-20 w-20 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading appointments...</p>
          </div>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <div className="bg-white shadow-lg border border-gray-100 rounded-lg p-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm text-gray-500">Schedule</p>
          <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
          <p className="text-sm text-gray-500 mt-1">Track and manage all upcoming visits.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/appointments/calendar"
            className="inline-flex items-center px-4 py-2 bg-purple-50 text-purple-700 rounded-lg font-medium hover:bg-purple-100 transition-colors"
          >
            Calendar View
          </Link>
          <Link
            href="/appointments/new"
            className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
          >
            New Appointment
          </Link>
        </div>
      </div>

      <div className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="bg-white shadow rounded-lg p-4">
          <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-2">
            Filter by Status
          </label>
          <select
            id="status-filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value as AppointmentStatus | 'all')}
            className="block w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Appointments</option>
            <option value={AppointmentStatus.SCHEDULED}>Scheduled</option>
            <option value={AppointmentStatus.COMPLETED}>Completed</option>
            <option value={AppointmentStatus.CANCELLED}>Cancelled</option>
          </select>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {filteredAppointments.length === 0 ? (
              <li className="px-6 py-8 text-center text-gray-500">
                No appointments found.{' '}
                <Link href="/appointments/new" className="text-blue-600 hover:text-blue-800">
                  Schedule the first appointment
                </Link>.
              </li>
            ) : (
              filteredAppointments.map((appointment) => (
                <li key={appointment.id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                            <span className="text-gray-700 font-medium text-sm">
                              {appointment.patient.firstName[0]}{appointment.patient.lastName[0]}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {appointment.patient.firstName} {appointment.patient.lastName}
                          </div>
                          <div className="text-sm text-gray-500">
                            Dr. {appointment.dentist.firstName} {appointment.dentist.lastName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {new Date(appointment.appointmentDate).toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(appointment.status)}`}>
                          {appointment.status}
                        </span>
                        <Link
                          href={`/appointments/${appointment.id}`}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                        >
                          View
                        </Link>
                        <Link
                          href={`/appointments/${appointment.id}/edit`}
                          className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-sm"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(appointment.id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </DashboardShell>
  );
}
