'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Dental Clinic Management
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Welcome to your dental clinic management system. Manage patients, appointments, and billing efficiently.
          </p>
        </div>
        <div className="space-y-4">
          <Link
            href="/login"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Go to Dashboard
          </Link>
          <p className="text-sm text-gray-500">
            Demo: Use any email with password "password"
          </p>
        </div>
      </div>
    </div>
  );
}
