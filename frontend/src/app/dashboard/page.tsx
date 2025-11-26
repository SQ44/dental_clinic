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
      {loading && <div className="rounded-3xl border border-slate-100 bg-white p-4 text-slate-600 shadow-sm">Loading dashboard...</div>}
      {error && <div className="rounded-3xl border border-rose-200 bg-rose-50 p-4 text-rose-600">{error}</div>}

      {!loading && data && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="Patients" value={data.patientsCount} icon={<svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>} />
            <StatCard title="Appointments Today" value={data.appointmentsToday} icon={<svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4v10a2 2 0 002 2h4a2 2 0 002-2V11M9 11h6"/></svg>} accent="bg-indigo-50 text-indigo-600" />
            <StatCard title="Revenue (This Month)" value={`$${data.revenueThisMonth.toFixed(2)}`} icon={<svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 11V9a3 3 0 013-3h1m-4 8v2a3 3 0 003 3h1m-4-8H7a3 3 0 00-3 3v1"/></svg>} accent="bg-emerald-50 text-emerald-600" />
            <StatCard title="Pending Payments" value={data.invoices.filter((i: any) => i.status !== 'paid').length} icon={<svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2"/></svg>} accent="bg-amber-50 text-amber-600" />
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-lg shadow-slate-200/60">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">Revenue (last 6 months)</h2>
                <Link href="/billing" className="text-sm text-sky-600 hover:text-sky-500">View invoices</Link>
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
          <div className="rounded-3xl border border-slate-100 bg-white p-6 text-slate-900 shadow-lg shadow-slate-200/60">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Upcoming Appointments</h2>
              <Link href="/appointments" className="text-sm text-sky-600 hover:text-sky-500">View all</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-slate-600">
                <thead>
                  <tr className="text-left text-xs uppercase text-slate-400">
                    <th className="py-2 font-semibold">Time</th>
                    <th className="py-2 font-semibold">Patient</th>
                    <th className="py-2 font-semibold">Dentist</th>
                    <th className="py-2 font-semibold">Type</th>
                    <th className="py-2 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="transition hover:bg-sky-50/60">
                    <td className="py-3">09:00 AM</td>
                    <td className="py-3">Jane Doe</td>
                    <td className="py-3">Dr. John Smith</td>
                    <td className="py-3">Cleaning</td>
                    <td className="py-3">
                      <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">Confirmed</span>
                    </td>
                  </tr>
                  <tr className="transition hover:bg-sky-50/60">
                    <td className="py-3">10:30 AM</td>
                    <td className="py-3">Bob Williams</td>
                    <td className="py-3">Dr. Jane Smith</td>
                    <td className="py-3">Filling</td>
                    <td className="py-3">
                      <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">Pending</span>
                    </td>
                  </tr>
                  <tr className="transition hover:bg-sky-50/60">
                    <td className="py-3">01:00 PM</td>
                    <td className="py-3">Alice Brown</td>
                    <td className="py-3">Dr. John Smith</td>
                    <td className="py-3">Extraction</td>
                    <td className="py-3">
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">Scheduled</span>
                    </td>
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
