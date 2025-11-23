'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { billingApi } from '@/lib/api';
import { Invoice, InvoiceStatus } from '@/types';
import DashboardShell from '@/components/DashboardShell';

export default function BillingPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const data = await billingApi.getAllInvoices();
      setInvoices(data);
    } catch (err) {
      setError('Failed to load invoices');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this invoice?')) return;

    try {
      await billingApi.deleteInvoice(id);
      setInvoices(invoices.filter(invoice => invoice.id !== id));
    } catch (err) {
      setError('Failed to delete invoice');
    }
  };

  const getStatusColor = (status: InvoiceStatus) => {
    switch (status) {
      case InvoiceStatus.PAID:
        return 'bg-green-100 text-green-800';
      case InvoiceStatus.OVERDUE:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  if (loading) {
    return (
      <DashboardShell>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-20 w-20 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading invoices...</p>
          </div>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <div className="bg-white shadow-lg border border-gray-100 rounded-lg p-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm text-gray-500">Finance</p>
          <h1 className="text-2xl font-bold text-gray-900">Billing</h1>
          <p className="text-sm text-gray-500 mt-1">Keep track of invoices and outstanding balances.</p>
        </div>
        <Link
          href="/billing/new"
          className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
        >
          Create Invoice
        </Link>
      </div>

      <div className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {invoices.length === 0 ? (
              <li className="px-6 py-8 text-center text-gray-500">
                No invoices found.{' '}
                <Link href="/billing/new" className="text-blue-600 hover:text-blue-800">
                  Create the first invoice
                </Link>.
              </li>
            ) : (
              invoices.map((invoice) => (
                <li key={invoice.id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                            <span className="text-gray-700 font-medium text-sm">
                              {invoice.patient.firstName[0]}{invoice.patient.lastName[0]}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            Invoice #{invoice.id}
                          </div>
                          <div className="text-sm text-gray-500">
                            {invoice.patient.firstName} {invoice.patient.lastName} - ${invoice.totalAmount.toFixed(2)}
                          </div>
                          <div className="text-sm text-gray-500">
                            Due: {invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : 'N/A'}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                          {invoice.status}
                        </span>
                        <Link
                          href={`/billing/${invoice.id}`}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                        >
                          View
                        </Link>
                        <Link
                          href={`/billing/${invoice.id}/edit`}
                          className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-sm"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(invoice.id)}
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
