"use client";

import DashboardShell from '@/components/DashboardShell';
import StatCard from '@/components/StatCard';
import RevenueChart from '@/components/RevenueChart';
import RecentPatients from '@/components/RecentPatients';
import { useDashboardData } from '@/hooks/useDashboardData';
import Link from 'next/link';
export const dynamic = 'force-dynamic';

export default function DashboardPage() {
  const { data, loading, error } = useDashboardData();

  return (
    <DashboardShell>
      {loading && <div className="p-4 bg-white rounded shadow">Loading dashboard...</div>}
      {error && <div className="p-4 bg-red-50 text-red-700 rounded shadow">{error}</div>}

      {!loading && data && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="Patients" value={data.patientsCount} icon={<svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>} />
            <StatCard title="Appointments Today" value={data.appointmentsToday} icon={<svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4v10a2 2 0 002 2h4a2 2 0 002-2V11M9 11h6"/></svg>} accent={'bg-indigo-50 text-indigo-600'} />
            <StatCard title="Revenue (This Month)" value={`$${data.revenueThisMonth.toFixed(2)}`} icon={<svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 11V9a3 3 0 013-3h1m-4 8v2a3 3 0 003 3h1m-4-8H7a3 3 0 00-3 3v1"/></svg>} accent={'bg-green-50 text-green-600'} />
            <StatCard title="Pending Payments" value={data.invoices.filter((i: any) => i.status !== 'paid').length} icon={<svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2"/></svg>} accent={'bg-yellow-50 text-yellow-600'} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold">Revenue (last 6 months)</h2>
                <Link href="/billing" className="text-sm text-indigo-600 hover:underline">View invoices</Link>
              </div>
              <RevenueChart data={data.revenueHistory} labels={Array.from({length: data.revenueHistory.length}, (_,i)=>{
                const d = new Date();
                d.setMonth(d.getMonth() - (data.revenueHistory.length - 1 - i));
                return d.toLocaleString(undefined, { month: 'short' });
              })} />
            </div>

            <div className="lg:col-span-1">
              <RecentPatients patients={data.recentPatients} />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Upcoming Appointments</h2>
              <Link href="/appointments" className="text-sm text-indigo-600 hover:underline">View all</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-gray-500 uppercase">
                    <th className="py-2">Time</th>
                    <th className="py-2">Patient</th>
                    <th className="py-2">Dentist</th>
                    <th className="py-2">Type</th>
                    <th className="py-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="py-3">09:00 AM</td>
                    <td className="py-3">Jane Doe</td>
                    <td className="py-3">Dr. John Smith</td>
                    <td className="py-3">Cleaning</td>
                    <td className="py-3"><span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Confirmed</span></td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="py-3">10:30 AM</td>
                    <td className="py-3">Bob Williams</td>
                    <td className="py-3">Dr. Jane Smith</td>
                    <td className="py-3">Filling</td>
                    <td className="py-3"><span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">Pending</span></td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="py-3">01:00 PM</td>
                    <td className="py-3">Alice Brown</td>
                    <td className="py-3">Dr. John Smith</td>
                    <td className="py-3">Extraction</td>
                    <td className="py-3"><span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">Scheduled</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </DashboardShell>
  );
}
