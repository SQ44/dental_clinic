"use client";

import React from 'react';

interface Props {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  accent?: string; // tailwind background color class for icon bg
}

export default function StatCard({ title, value, icon, accent = 'bg-blue-50 text-blue-600' }: Props) {
  return (
    <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transform hover:scale-105 transition-transform duration-150">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-500">{title}</p>
          <p className="text-2xl font-semibold">{value}</p>
        </div>
        <div className={`${accent} p-2 rounded-md flex items-center justify-center`}>{icon}</div>
      </div>
    </div>
  );
}
