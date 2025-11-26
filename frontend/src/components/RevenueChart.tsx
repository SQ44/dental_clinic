"use client";

import React from 'react';

interface Props {
  // data is array of numbers (last N months)
  data: number[];
  labels?: string[];
}

// Simple sparkline-style bar chart using SVG
export default function RevenueChart({ data, labels }: Props) {
  const width = 320;
  const height = 72;
  const max = Math.max(...data, 1);
  const barWidth = width / data.length;

  return (
    <div className="w-full">
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <defs>
          <linearGradient id="g1" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.6" />
          </linearGradient>
        </defs>
        {data.map((v, i) => {
          const h = (v / max) * (height - 12);
          const x = i * barWidth + 4;
          const y = height - h - 4;
          return <rect key={i} x={x} y={y} width={Math.max(4, barWidth - 8)} height={h} rx={3} fill="url(#g1)" opacity={0.95} />;
        })}
      </svg>
      <div className="mt-2 flex justify-between text-xs text-slate-500">
        {labels?.map((l, i) => (
          <span key={i} className="truncate" style={{ width: `${100 / labels.length}%` }}>{l}</span>
        ))}
      </div>
    </div>
  );
}
