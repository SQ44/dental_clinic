'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { patientsApi } from '@/lib/api';
import { CreatePatientDto } from '@/types';
import Link from 'next/link';
import FormPageLayout from '@/components/FormPageLayout';
import { formControlClasses, formLabelClasses, formHintClasses } from '@/lib/formStyles';

export default function NewPatientPage() {
  const [formData, setFormData] = useState<CreatePatientDto>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    address: '',
    medicalHistory: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await patientsApi.create(formData);
      router.push('/patients');
    } catch (err) {
      setError('Failed to create patient');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const inputClassName = `${formControlClasses}`;

  return (
    <FormPageLayout
      title="Add New Patient"
      description="Capture the essential personal, contact, and medical details for every new patient."
      badge="Patient Intake"
      backHref="/patients"
      backLabel="Patients"
    >
      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-10">
        <section className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Personal Details</h2>
            <p className="text-sm text-slate-500">Used for the patient record and insurance submissions.</p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="firstName" className={formLabelClasses}>
                First Name *
              </label>
              <p className={formHintClasses}>As shown on official documents.</p>
              <input
                type="text"
                name="firstName"
                id="firstName"
                required
                value={formData.firstName}
                onChange={handleChange}
                className={`${inputClassName} mt-2`}
                placeholder="Jane"
              />
            </div>

            <div>
              <label htmlFor="lastName" className={formLabelClasses}>
                Last Name *
              </label>
              <p className={formHintClasses}>Family name / surname.</p>
              <input
                type="text"
                name="lastName"
                id="lastName"
                required
                value={formData.lastName}
                onChange={handleChange}
                className={`${inputClassName} mt-2`}
                placeholder="Doe"
              />
            </div>

            <div>
              <label htmlFor="dateOfBirth" className={formLabelClasses}>
                Date of Birth
              </label>
              <p className={formHintClasses}>Helps us confirm eligibility and treatment options.</p>
              <input
                type="date"
                name="dateOfBirth"
                id="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className={`${inputClassName} mt-2`}
              />
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Contact Information</h2>
            <p className="text-sm text-slate-500">We use this to send reminders and share treatment plans.</p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="email" className={formLabelClasses}>
                Email *
              </label>
              <p className={formHintClasses}>Appointment confirmations and invoices are delivered here.</p>
              <input
                type="email"
                name="email"
                id="email"
                required
                value={formData.email}
                onChange={handleChange}
                className={`${inputClassName} mt-2`}
                placeholder="jane@example.com"
              />
            </div>

            <div>
              <label htmlFor="phone" className={formLabelClasses}>
                Phone
              </label>
              <p className={formHintClasses}>Optional but recommended for urgent updates.</p>
              <input
                type="tel"
                name="phone"
                id="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`${inputClassName} mt-2`}
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </div>

          <div>
            <label htmlFor="address" className={formLabelClasses}>
              Address
            </label>
            <p className={formHintClasses}>Street, city, state, and ZIP.</p>
            <textarea
              name="address"
              id="address"
              rows={3}
              value={formData.address}
              onChange={handleChange}
              className={`${inputClassName} mt-2`}
              placeholder="123 Main Street, Springfield, CA 90001"
            />
          </div>
        </section>

        <section className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Medical Background</h2>
            <p className="text-sm text-slate-500">Share allergies, chronic conditions, and other context for safe care.</p>
          </div>

          <div>
            <label htmlFor="medicalHistory" className={formLabelClasses}>
              Medical History
            </label>
            <textarea
              name="medicalHistory"
              id="medicalHistory"
              rows={5}
              value={formData.medicalHistory}
              onChange={handleChange}
              className={`${inputClassName} mt-2`}
              placeholder="Allergies, prior procedures, current medications..."
            />
          </div>
        </section>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Link
            href="/patients"
            className="inline-flex items-center justify-center rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:opacity-60"
          >
            {loading ? 'Creating...' : 'Create Patient'}
          </button>
        </div>
      </form>
    </FormPageLayout>
  );
}
