"use client";

import React from 'react';
import { useAuth } from '@/hooks/useAuth';

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="h-10 w-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-md flex items-center justify-center text-white font-bold">DC</div>
            <div>
              <h1 className="text-lg font-semibold">Dental Clinic Management</h1>
              <p className="text-xs text-gray-500">Welcome back{user?.email ? `, ${user.email}` : ''}</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <input
              type="search"
              placeholder="Search patients, appointments..."
              className="hidden sm:block border rounded-md px-3 py-1 w-64 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button className="p-2 rounded-full hover:bg-gray-100" title="Notifications">
              <svg className="h-6 w-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-600 hidden sm:inline">{user?.email}</span>
              <button onClick={logout} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm">Logout</button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
