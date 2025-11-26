"use client";

import React from 'react';
import Link from 'next/link';
import { Patient } from '@/types';

interface Props {
  patients: Patient[];
}

export default function RecentPatients({ patients }: Props) {
  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-6 text-slate-900 shadow-lg shadow-slate-200/60">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Recent Patients</h3>
        <Link href="/patients" className="text-sm font-medium text-sky-600 hover:text-sky-500">
          View all
        </Link>
      </div>
      <div className="space-y-3 text-sm">
        {patients.length === 0 && <p className="text-slate-500">No recent patients</p>}
        {patients.map((p) => (
          <div
            key={p.id}
            className="flex items-center justify-between rounded-2xl border border-slate-100 px-3 py-2 text-slate-600 transition hover:border-sky-100 hover:bg-sky-50/60"
          >
            <div>
              <p className="font-medium text-slate-900">
                {p.firstName} {p.lastName}
              </p>
              <p className="text-xs text-slate-500">{p.email}</p>
            </div>
            <div className="text-xs text-slate-500">{new Date(p.createdAt).toLocaleDateString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
