'use client';

import { useEffect, useMemo, useState } from 'react';
import DashboardShell from '@/components/DashboardShell';
import { paymentsApi } from '@/lib/api';
import { Payment, PaymentStatus } from '@/types';
import Link from 'next/link';

const statusBadgeMap: Record<PaymentStatus, string> = {
  [PaymentStatus.PENDING]: 'bg-amber-100 text-amber-800',
  [PaymentStatus.SUCCEEDED]: 'bg-green-100 text-green-800',
  [PaymentStatus.FAILED]: 'bg-red-100 text-red-800',
  [PaymentStatus.CANCELLED]: 'bg-gray-100 text-gray-700',
};

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | PaymentStatus>('all');

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await paymentsApi.getAll();
      const normalized = data.map((payment) => ({
        ...payment,
        amount: typeof payment.amount === 'string' ? parseFloat(payment.amount) : payment.amount,
        invoice: payment.invoice
          ? {
              ...payment.invoice,
              totalAmount:
                typeof payment.invoice.totalAmount === 'string'
                  ? parseFloat(payment.invoice.totalAmount)
                  : payment.invoice.totalAmount,
            }
          : payment.invoice,
      }));
      setPayments(normalized);
    } catch (err) {
      setError('Unable to load payments. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filteredPayments = useMemo(() => {
    if (filter === 'all') return payments;
    return payments.filter((payment) => payment.status === filter);
  }, [payments, filter]);

  const stats = useMemo(() => {
    const totalCollected = payments
      .filter((payment) => payment.status === PaymentStatus.SUCCEEDED)
      .reduce((sum, p) => sum + (p.amount || 0), 0);
    const outstanding = payments
      .filter((payment) => payment.status === PaymentStatus.PENDING)
      .reduce((sum, p) => sum + (p.amount || 0), 0);
    const failed = payments.filter((payment) => payment.status === PaymentStatus.FAILED).length;
    return {
      totalPayments: payments.length,
      totalCollected,
      outstanding,
      failed,
    };
  }, [payments]);

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">Billing & Payments</p>
            <h1 className="text-2xl font-bold text-gray-900">Payments Overview</h1>
            <p className="text-sm text-gray-500 mt-1">
              Monitor all recent settlements, pending invoices, and failed attempts in one view.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={fetchPayments}
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
            >
              Refresh
            </button>
            <Link
              href="/billing"
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
            >
              Go to Billing
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Payments Recorded" value={stats.totalPayments.toString()} />
          <StatCard label="Collected (USD)" value={`$${stats.totalCollected.toFixed(2)}`} accent="text-green-600" />
          <StatCard label="Outstanding (USD)" value={`$${stats.outstanding.toFixed(2)}`} accent="text-amber-600" />
          <StatCard label="Failed Attempts" value={stats.failed.toString()} accent="text-red-600" />
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Payments Activity</h2>
              <p className="text-sm text-gray-500">Filter payments by status to focus on pending or failed charges.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as 'all' | PaymentStatus)}
                className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All statuses</option>
                <option value={PaymentStatus.PENDING}>Pending</option>
                <option value={PaymentStatus.SUCCEEDED}>Succeeded</option>
                <option value={PaymentStatus.FAILED}>Failed</option>
                <option value={PaymentStatus.CANCELLED}>Cancelled</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="py-12 text-center text-gray-500">Loading payments...</div>
          ) : error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
          ) : filteredPayments.length === 0 ? (
            <div className="py-10 text-center text-sm text-gray-500">
              No payments match this filter. Try selecting a different status.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead>
                  <tr className="text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    <th className="py-3">Date</th>
                    <th className="py-3">Invoice</th>
                    <th className="py-3">Patient</th>
                    <th className="py-3">Amount</th>
                    <th className="py-3">Status</th>
                    <th className="py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredPayments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-gray-50/70">
                      <td className="py-3 text-gray-600">
                        {new Date(payment.createdAt).toLocaleString(undefined, {
                          dateStyle: 'medium',
                          timeStyle: 'short',
                        })}
                      </td>
                      <td className="py-3 text-gray-900 font-medium">
                        #{payment.invoice?.id ?? payment.invoiceId}
                      </td>
                      <td className="py-3 text-gray-700">
                        {payment.invoice?.patient
                          ? `${payment.invoice.patient.firstName} ${payment.invoice.patient.lastName}`
                          : '—'}
                      </td>
                      <td className="py-3 font-semibold text-gray-900">${payment.amount.toFixed(2)}</td>
                      <td className="py-3">
                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusBadgeMap[payment.status]}`}>
                          {payment.status}
                        </span>
                      </td>
                      <td className="py-3">
                        <Link
                          href={`/billing/${payment.invoiceId}`}
                          className="text-indigo-600 hover:text-indigo-800 font-medium"
                        >
                          View invoice
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}

type StatCardProps = {
  label: string;
  value: string;
  accent?: string;
};

function StatCard({ label, value, accent }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</p>
      <p className={`mt-2 text-2xl font-bold text-gray-900 ${accent ?? ''}`}>{value}</p>
    </div>
  );
}
