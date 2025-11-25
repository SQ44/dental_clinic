"use client";

import React from 'react';
import Link from 'next/link';
import DashboardShell from '@/components/DashboardShell';

type FormPageLayoutProps = {
  title: string;
  description?: string;
  badge?: string;
  backHref: string;
  backLabel?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
};

export default function FormPageLayout({
  title,
  description,
  badge,
  backHref,
  backLabel = 'Back',
  actions,
  children,
}: FormPageLayoutProps) {
  return (
    <DashboardShell>
      <div className="space-y-6 w-full max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            {badge && <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">{badge}</p>}
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href={backHref}
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
            >
              <span aria-hidden="true">←</span>
              {backLabel}
            </Link>
            {actions}
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur rounded-2xl border border-gray-100 shadow-xl p-6 sm:p-8">
          <div className="max-w-4xl mx-auto w-full space-y-8">{children}</div>
        </div>
      </div>
    </DashboardShell>
  );
}
