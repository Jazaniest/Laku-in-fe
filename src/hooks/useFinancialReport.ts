import { useState, useEffect, useCallback } from 'react';
import type { FinancialReport, FinancialFilters } from '@/types/financial.types';
import { financialService } from '@/services/financial.service';

export const useFinancialReport = (initialFilters?: FinancialFilters) => {
  const [data, setData] = useState<FinancialReport | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FinancialFilters>(initialFilters || {});

  const fetchReport = useCallback(async () => {
    try {
      setLoading(true);
      const report = await financialService.getFinancialReport(filters);
      setData(report);
      setError(null);
    } catch (err) {
      setError('Gagal memuat laporan keuangan');
      console.error('Financial report fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  const updateFilters = (newFilters: Partial<FinancialFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const resetFilters = () => {
    setFilters({});
  };

  const exportReport = async (format: 'pdf' | 'excel') => {
    try {
      const filename = await financialService.exportReport(format, filters);
      console.log('Report exported:', filename);
      return filename;
    } catch (err) {
      console.error('Export error:', err);
      throw err;
    }
  };

  return {
    data,
    loading,
    error,
    filters,
    updateFilters,
    resetFilters,
    refreshReport: fetchReport,
    exportReport
  };
};