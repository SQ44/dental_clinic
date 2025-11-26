"use client";

import React from 'react';

interface Props {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  accent?: string; // tailwind background color class for icon bg
}

export default function StatCard({ title, value, icon, accent = 'bg-sky-100 text-sky-500' }: Props) {
  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-5 text-slate-900 shadow-sm shadow-slate-200 transition hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{title}</p>
          <p className="text-3xl font-semibold text-slate-900">{value}</p>
        </div>
        <div className={`${accent} flex items-center justify-center rounded-2xl p-3`}>{icon}</div>
      </div>
    </div>
  );
}
