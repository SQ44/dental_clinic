"use client";

import React from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';

type DashboardShellProps = {
  children: React.ReactNode;
};

export default function DashboardShell({ children }: DashboardShellProps) {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-sky-50 via-white to-white text-slate-900">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-16 right-0 h-64 w-64 rounded-full bg-sky-200/60 blur-3xl" />
        <div className="absolute bottom-0 left-10 h-96 w-96 rounded-full bg-rose-100/60 blur-3xl" />
      </div>

      <div className="relative z-10">
        <Header />

        <div className="mx-auto w-full max-w-[1600px] py-8 px-4 sm:px-6 lg:px-10">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
            <Sidebar />

            <section className="lg:col-span-3 space-y-6">
              {children}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
