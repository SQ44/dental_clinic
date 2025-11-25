'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { billingApi } from '@/lib/api';
import { CreateBillingItemDto, BillingItemType } from '@/types';
import Link from 'next/link';
import FormPageLayout from '@/components/FormPageLayout';
import { formControlClasses, formHintClasses, formLabelClasses } from '@/lib/formStyles';

export default function NewBillingItemPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<CreateBillingItemDto>({
    invoiceId: 0,
    description: '',
    type: BillingItemType.TREATMENT,
    quantity: 1,
    unitPrice: 0,
  });

  const invoiceId = parseInt(params.id as string);

  useEffect(() => {
    if (invoiceId) {
      setFormData(prev => ({ ...prev, invoiceId }));
    }
  }, [invoiceId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await billingApi.createBillingItem(invoiceId, formData);
      router.push(`/billing/${invoiceId}`);
    } catch (err) {
      setError('Failed to create billing item');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value,
    }));
  };

  const inputClassName = `${formControlClasses}`;

  return (
    <FormPageLayout
      title="Add Billing Item"
      description="Document the treatment or product that should be billed on this invoice."
      badge="Billing"
      backHref={`/billing/${invoiceId}`}
      backLabel="Invoice"
    >
      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <section className="rounded-2xl border border-gray-100 bg-slate-50/40 p-6 space-y-6">
          <div>
            <label htmlFor="description" className={formLabelClasses}>
              Description
            </label>
            <p className={formHintClasses}>Include procedure specifics or product notes for transparency.</p>
            <textarea
              id="description"
              name="description"
              required
              rows={3}
              value={formData.description}
              onChange={handleChange}
              className={`${inputClassName} mt-2`}
              placeholder="Composite filling for tooth #12"
            />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div>
              <label htmlFor="type" className={formLabelClasses}>
                Type
              </label>
              <p className={formHintClasses}>Choose how this line item should be categorized.</p>
              <select
                id="type"
                name="type"
                required
                value={formData.type}
                onChange={handleChange}
                className={`${inputClassName} mt-2`}
              >
                <option value={BillingItemType.TREATMENT}>{BillingItemType.TREATMENT}</option>
                <option value={BillingItemType.PROCEDURE}>{BillingItemType.PROCEDURE}</option>
              </select>
            </div>

            <div>
              <label htmlFor="quantity" className={formLabelClasses}>
                Quantity
              </label>
              <p className={formHintClasses}>How many units should be billed?</p>
              <input
                type="number"
                id="quantity"
                name="quantity"
                required
                min="1"
                value={formData.quantity}
                onChange={handleChange}
                className={`${inputClassName} mt-2`}
              />
            </div>

            <div>
              <label htmlFor="unitPrice" className={formLabelClasses}>
                Unit Price ($)
              </label>
              <p className={formHintClasses}>Enter the agreed cost per unit.</p>
              <input
                type="number"
                id="unitPrice"
                name="unitPrice"
                required
                min="0"
                step="0.01"
                value={formData.unitPrice}
                onChange={handleChange}
                className={`${inputClassName} mt-2`}
              />
            </div>
          </div>
        </section>

        <div className="rounded-2xl border border-indigo-100 bg-indigo-50 px-4 py-5">
          <p className="text-sm font-semibold text-indigo-900">
            Line Item Total: ${((formData.quantity || 1) * formData.unitPrice).toFixed(2)}
          </p>
          <p className="text-xs text-indigo-700">This amount will be added to the invoice balance.</p>
        </div>

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
            {loading ? 'Adding...' : 'Add Item'}
          </button>
        </div>
      </form>
    </FormPageLayout>
  );
}
