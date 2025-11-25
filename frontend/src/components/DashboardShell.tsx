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

      <div className="w-full max-w-[1600px] mx-auto py-6 px-4 sm:px-6 lg:px-10">
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
