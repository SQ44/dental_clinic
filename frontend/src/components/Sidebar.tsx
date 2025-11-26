"use client";

import React from 'react';
import Link from 'next/link';

export default function Sidebar() {
  const links = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/patients', label: 'Patients' },
    { href: '/appointments', label: 'Appointments' },
    { href: '/billing', label: 'Billing' },
    { href: '/payments', label: 'Payments' },
  ];

  return (
    <aside className="lg:col-span-1 rounded-3xl border border-slate-100 bg-white p-5 text-slate-900 shadow-xl shadow-slate-200">
      <nav className="space-y-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`block rounded-2xl px-4 py-2 text-sm font-medium text-slate-500 transition hover:bg-sky-50 hover:text-slate-900 ${
              link.href === '/dashboard' ? 'bg-sky-50 text-slate-900 shadow-sm' : ''
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="mt-8">
        <h3 className="text-xs uppercase tracking-[0.3em] text-slate-400">Quick Actions</h3>
        <div className="mt-3 flex flex-col gap-3 text-sm font-semibold">
          <Link
            href="/patients/new"
            className="rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-400 px-4 py-2 text-center text-white shadow-lg shadow-emerald-200 transition hover:opacity-90"
          >
            New Patient
          </Link>
          <Link
            href="/appointments/new"
            className="rounded-2xl bg-gradient-to-r from-purple-400 to-sky-400 px-4 py-2 text-center text-white shadow-lg shadow-purple-200 transition hover:opacity-90"
          >
            New Appointment
          </Link>
        </div>
      </div>
    </aside>
  );
}
