"use client";

import React from 'react';
import Link from 'next/link';
import { Patient } from '@/types';

interface Props {
  patients: Patient[];
}

export default function RecentPatients({ patients }: Props) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Recent Patients</h3>
        <Link href="/patients" className="text-sm text-indigo-600 hover:underline">View all</Link>
      </div>
      <div className="space-y-3">
        {patients.length === 0 && <p className="text-sm text-gray-500">No recent patients</p>}
        {patients.map((p) => (
          <div key={p.id} className="flex items-center justify-between hover:bg-gray-50 p-2 rounded transition-colors">
            <div>
              <p className="font-medium">{p.firstName} {p.lastName}</p>
              <p className="text-xs text-gray-500">{p.email}</p>
            </div>
            <div className="text-sm text-gray-500">{new Date(p.createdAt).toLocaleDateString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
