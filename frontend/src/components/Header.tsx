"use client";

import React from 'react';
import { useAuth } from '@/hooks/useAuth';

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-20 border-b border-slate-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 to-cyan-400 text-lg font-bold text-white shadow-lg shadow-sky-200/60">
            DO
          </div>
          <div>
            <h1 className="text-lg font-semibold text-slate-900">Lumineer DentalOS</h1>
            <p className="text-xs text-slate-500">Welcome back{user?.email ? `, ${user.email}` : ''}</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <input
            type="search"
            placeholder="Search patients, appointments..."
            className="hidden w-64 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100 sm:block"
          />
          <button className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700" title="Notifications">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>
          <div className="flex items-center space-x-3">
            <span className="hidden text-sm text-slate-600 sm:inline">{user?.email}</span>
            <button
              onClick={logout}
              className="rounded-full bg-gradient-to-r from-rose-400 to-orange-400 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
