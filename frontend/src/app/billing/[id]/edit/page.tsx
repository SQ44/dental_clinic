'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { billingApi } from '@/lib/api';
import { UpdateInvoiceDto, Invoice, InvoiceStatus } from '@/types';
import Link from 'next/link';
import FormPageLayout from '@/components/FormPageLayout';
import { formControlClasses, formHintClasses, formLabelClasses } from '@/lib/formStyles';

export default function EditInvoicePage() {
  const params = useParams();
  const router = useRouter();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<UpdateInvoiceDto>({
    status: undefined,
    dueDate: '',
  });

  const invoiceId = parseInt(params.id as string);

  useEffect(() => {
    if (invoiceId) {
      fetchInvoice();
    }
  }, [invoiceId]);

  const fetchInvoice = async () => {
    try {
      const data = await billingApi.getInvoiceById(invoiceId);
      setInvoice(data);
      setFormData({
        status: data.status,
        dueDate: data.dueDate || '',
      });
    } catch (err) {
      setError('Failed to load invoice');
    } finally {
      setFetchLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await billingApi.updateInvoice(invoiceId, formData);
      router.push(`/billing/${invoiceId}`);
    } catch (err) {
      setError('Failed to update invoice');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const inputClassName = `${formControlClasses}`;

  return (
    <FormPageLayout
      title={invoice ? `Edit Invoice #${invoice.id}` : 'Edit Invoice'}
      description="Adjust invoice status and payment expectations to keep receivables accurate."
      badge="Billing"
      backHref={`/billing/${invoiceId}`}
      backLabel="Invoice"
    >
      {fetchLoading ? (
        <div className="flex flex-col items-center justify-center py-12 text-sm text-gray-500">
          <div className="mb-3 h-10 w-10 animate-spin rounded-full border-b-2 border-indigo-500"></div>
          Loading invoice details...
        </div>
      ) : !invoice ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-6 text-center text-sm text-amber-700">
          We couldn’t find that invoice. Please return to Billing and try again.
        </div>
      ) : (
        <>
          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <section className="space-y-4 rounded-2xl border border-gray-100 bg-slate-50/40 p-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Invoice Status</h3>
                <p className="text-sm text-slate-500">Keep finance dashboards accurate with up-to-date tracking.</p>
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label htmlFor="status" className={formLabelClasses}>
                    Status
                  </label>
                  <p className={formHintClasses}>Reflect the latest payment stage for clear reporting.</p>
                  <select
                    id="status"
                    name="status"
                    value={formData.status || ''}
                    onChange={handleChange}
                    className={`${inputClassName} mt-2`}
                  >
                    <option value="">Select status</option>
                    <option value={InvoiceStatus.PENDING}>{InvoiceStatus.PENDING}</option>
                    <option value={InvoiceStatus.PAID}>{InvoiceStatus.PAID}</option>
                    <option value={InvoiceStatus.OVERDUE}>{InvoiceStatus.OVERDUE}</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="dueDate" className={formLabelClasses}>
                    Due Date
                  </label>
                  <p className={formHintClasses}>Optional—set when payment should be completed.</p>
                  <input
                    type="date"
                    id="dueDate"
                    name="dueDate"
                    value={formData.dueDate || ''}
                    onChange={handleChange}
                    className={`${inputClassName} mt-2`}
                  />
                </div>
              </div>
            </section>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Link
                href={`/billing/${invoiceId}`}
                className="inline-flex items-center justify-center rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:opacity-60"
              >
                {loading ? 'Updating...' : 'Update Invoice'}
              </button>
            </div>
          </form>
        </>
      )}
    </FormPageLayout>
  );
}
