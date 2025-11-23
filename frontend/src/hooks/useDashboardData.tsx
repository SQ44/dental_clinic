"use client";

import { useEffect, useState } from 'react';
import { patientsApi, appointmentsApi, billingApi } from '@/lib/api';
import { Patient, Appointment, Invoice } from '@/types';

export interface DashboardData {
  patientsCount: number;
  recentPatients: Patient[];
  appointmentsToday: number;
  invoices: Invoice[];
  revenueThisMonth: number;
  revenueHistory: number[]; // last 6 months
}

export function useDashboardData() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function fetchAll() {
      setLoading(true);
      try {
        const [patients, appointments, invoices] = await Promise.all([
          patientsApi.getAll(),
          appointmentsApi.getAll(),
          billingApi.getAllInvoices(),
        ]);

        // patients
        const patientsCount = patients.length;
        const recentPatients = patients
          .slice()
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 5);

        // appointments today
        const today = new Date();
        const appointmentsToday = appointments.filter((appt: Appointment) => {
          const d = new Date(appt.appointmentDate);
          return (
            d.getFullYear() === today.getFullYear() &&
            d.getMonth() === today.getMonth() &&
            d.getDate() === today.getDate()
          );
        }).length;

        // revenue this month, and last 6 months history
        const now = new Date();
        const revenueThisMonth = invoices.reduce((sum: number, inv: Invoice) => {
          const created = new Date(inv.createdAt);
          if (created.getFullYear() === now.getFullYear() && created.getMonth() === now.getMonth()) {
            return sum + Number(inv.totalAmount || 0);
          }
          return sum;
        }, 0);

        // last 6 months revenue
        const revenueHistory: number[] = [];
        for (let i = 5; i >= 0; i--) {
          const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
          const monthSum = invoices.reduce((sum: number, inv: Invoice) => {
            const created = new Date(inv.createdAt);
            if (created.getFullYear() === d.getFullYear() && created.getMonth() === d.getMonth()) {
              return sum + Number(inv.totalAmount || 0);
            }
            return sum;
          }, 0);
          revenueHistory.push(monthSum);
        }

        if (mounted) {
          setData({ patientsCount, recentPatients, appointmentsToday, invoices, revenueThisMonth, revenueHistory });
        }
      } catch (err: any) {
        console.error(err);
        if (mounted) setError(err?.message || 'Failed to load dashboard data');
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchAll();

    return () => {
      mounted = false;
    };
  }, []);

  return { data, loading, error, refresh: () => window.location.reload() };
}
