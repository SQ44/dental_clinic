'use client';

import DashboardShell from '@/components/DashboardShell';
import Link from 'next/link';

export default function PaymentsLandingPage() {
  return (
    <DashboardShell>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">Billing & Payments</p>
          <h1 className="text-2xl font-bold text-gray-900">Payments Overview</h1>
          <p className="text-sm text-gray-500 mt-1">
            Track invoices and settlement history. Payments are currently managed from the billing detail screens.
          </p>
        </div>
        <Link
          href="/billing"
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
        >
          Go to Billing
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-8 text-center text-sm text-gray-500">
        <p className="font-medium text-gray-700">Payments dashboard coming soon</p>
        <p className="mt-2">
          Use the billing section to review invoices, record line items, and capture payments. Each invoice detail page
          displays its Stripe payment intent and settlement state.
        </p>
        <p className="mt-4">
          Need to log a payment manually? Open an invoice from{' '}
          <Link href="/billing" className="text-indigo-600 hover:underline">
            the billing list
          </Link>{' '}
          and add items or process payments directly from that screen.
        </p>
      </div>
    </DashboardShell>
  );
}
