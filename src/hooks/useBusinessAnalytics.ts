import { useState, useEffect, useCallback } from 'react';
import type { BusinessAnalytics, AnalyticsFilters } from '@/types/analytics.types';
import { analyticsService } from '@/services/analytics.service';

export const useBusinessAnalytics = (initialFilters?: AnalyticsFilters) => {
  const [data, setData] = useState<BusinessAnalytics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<AnalyticsFilters>(initialFilters || {});

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      const analytics = await analyticsService.getBusinessAnalytics(filters);
      setData(analytics);
      setError(null);
    } catch (err) {
      setError('Gagal memuat analisis bisnis');
      console.error('Analytics fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const updateFilters = (newFilters: Partial<AnalyticsFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const resetFilters = () => {
    setFilters({});
  };

  return {
    data,
    loading,
    error,
    filters,
    updateFilters,
    resetFilters,
    refreshAnalytics: fetchAnalytics
  };
};

