'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { appointmentsApi } from '@/lib/api';
import { Appointment, AppointmentStatus } from '@/types';
import DashboardShell from '@/components/DashboardShell';

export default function CalendarPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentDate, setCurrentDate] = useState(new Date());

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

  const getDaysInMonth = (date: Date): (Date | null)[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const getAppointmentsForDate = (date: Date | null) => {
    if (!date) {
      return [];
    }

    return appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.appointmentDate);
      return appointmentDate.toDateString() === date.toDateString();
    });
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const getStatusColor = (status: AppointmentStatus) => {
    switch (status) {
      case AppointmentStatus.SCHEDULED:
        return 'bg-blue-500';
      case AppointmentStatus.COMPLETED:
        return 'bg-green-500';
      case AppointmentStatus.CANCELLED:
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const days = getDaysInMonth(currentDate);
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  if (loading) {
    return (
      <DashboardShell>
        <div className="w-full flex items-center justify-center py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading calendar...</p>
          </div>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">Appointments</p>
            <h1 className="text-2xl font-bold text-gray-900">Calendar View</h1>
            <p className="text-sm text-gray-500 mt-1">
              Review chair availability and jump into appointment details without leaving the dashboard shell.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/appointments"
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
            >
              ← Back to list
            </Link>
            <Link
              href="/appointments/new"
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
            >
              New Appointment
            </Link>
          </div>
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="bg-white shadow rounded-2xl overflow-hidden">
          {/* Calendar Header */}
          <div className="px-4 py-5 sm:p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h2>
                <div className="flex space-x-2">
                  <button
                    onClick={() => navigateMonth('prev')}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded text-sm"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => navigateMonth('next')}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded text-sm"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="p-4">
              <div className="grid grid-cols-7 gap-1">
                {/* Day headers */}
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="p-2 text-center text-sm font-medium text-gray-500 bg-gray-50">
                    {day}
                  </div>
                ))}

                {/* Calendar days */}
                {days.map((date, index) => {
                  if (!date) {
                    return (
                      <div
                        key={`${index}-empty`}
                        className="min-h-24 p-2 border border-gray-200 bg-gray-50"
                      />
                    );
                  }

                  const appointmentsForDay = getAppointmentsForDate(date);

                  return (
                    <div
                      key={date.toISOString()}
                      className="min-h-24 p-2 border border-gray-200 bg-white"
                    >
                      <div className="text-sm font-medium text-gray-900 mb-1">
                        {date.getDate()}
                      </div>
                      <div className="space-y-1">
                        {appointmentsForDay.map(appointment => (
                          <Link
                            key={appointment.id}
                            href={`/appointments/${appointment.id}`}
                            className={`block text-xs p-1 rounded text-white ${getStatusColor(appointment.status)} hover:opacity-80`}
                          >
                            <div className="font-medium truncate">
                              {appointment.patient.firstName} {appointment.patient.lastName}
                            </div>
                            <div className="text-xs opacity-90">
                              {new Date(appointment.appointmentDate).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
    </DashboardShell>
  );
}
