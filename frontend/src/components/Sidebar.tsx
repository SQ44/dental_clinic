"use client";

import React from 'react';
import Link from 'next/link';

export default function Sidebar() {
  return (
    <aside className="lg:col-span-1 bg-white rounded-lg shadow p-4">
      <nav className="space-y-1">
        <Link href="/dashboard" className="block px-3 py-2 rounded-md text-sm font-medium bg-indigo-50 text-indigo-700 transition-colors">Dashboard</Link>
        <Link href="/patients" className="block px-3 py-2 rounded-md text-sm hover:bg-indigo-50 transition-colors">Patients</Link>
        <Link href="/appointments" className="block px-3 py-2 rounded-md text-sm hover:bg-indigo-50 transition-colors">Appointments</Link>
        <Link href="/billing" className="block px-3 py-2 rounded-md text-sm hover:bg-indigo-50 transition-colors">Billing</Link>
        <Link href="/payments" className="block px-3 py-2 rounded-md text-sm hover:bg-indigo-50 transition-colors">Payments</Link>
      </nav>
      <div className="mt-6">
        <h3 className="text-xs text-gray-500 uppercase tracking-wide">Quick Actions</h3>
        <div className="mt-2 flex flex-col gap-2">
          <Link href="/patients/new" className="text-sm bg-green-600 text-white px-3 py-2 rounded-md text-center hover:opacity-95 transition-opacity">New Patient</Link>
          <Link href="/appointments/new" className="text-sm bg-purple-600 text-white px-3 py-2 rounded-md text-center hover:opacity-95 transition-opacity">New Appointment</Link>
        </div>
      </div>
    </aside>
  );
}
