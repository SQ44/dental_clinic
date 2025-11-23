"use client";

import React from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';

type DashboardShellProps = {
  children: React.ReactNode;
};

export default function DashboardShell({ children }: DashboardShellProps) {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <Header />

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <Sidebar />

          <section className="lg:col-span-3 space-y-6">
            {children}
          </section>
        </div>
      </div>
    </div>
  );
}
