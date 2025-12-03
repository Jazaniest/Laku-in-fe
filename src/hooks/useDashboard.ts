import { useState, useEffect } from 'react';
import type { DashboardData } from '@/types/dashboard.types';
import { dashboardService } from '@/services/dashboard.service';

export const useDashboard = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const dashboardData = await dashboardService.getDashboardData();
        setData(dashboardData);
        setError(null);
      } catch (err) {
        setError('Gagal memuat data dashboard');
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const refreshData = async () => {
    try {
      setLoading(true);
      const dashboardData = await dashboardService.getDashboardData();
      setData(dashboardData);
      setError(null);
    } catch (err) {
      setError('Gagal memuat data dashboard');
      console.error('Dashboard refresh error:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    error,
    refreshData
  };
};