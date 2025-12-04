import { useState, useEffect, useCallback, useRef } from 'react';
import type { FinancialReport, FinancialFilters } from '@/types/financial.types';
import { financialService } from '@/services/financial.service';

const SEARCH_DEBOUNCE_MS = 500;

export const useFinancialReport = (initialFilters?: FinancialFilters) => {
  const [data, setData] = useState<FinancialReport | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [tableLoading, setTableLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FinancialFilters>(initialFilters || {});

  const isInitialLoad = useRef(true);
  const searchTimeoutRef = useRef<number | null>(null);
  const previousFiltersRef = useRef<FinancialFilters>(filters);

  const fetchReport = useCallback(async (filtersToUse: FinancialFilters) => {
    try {
      if (isInitialLoad.current) {
        setLoading(true);
      } else {
        setTableLoading(true);
      }

      const report = await financialService.getFinancialReport(filtersToUse);
      setData(report);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal memuat laporan keuangan');
      console.error('Financial report fetch error:', err);
    } finally {
      if (isInitialLoad.current) {
        setLoading(false);
        isInitialLoad.current = false;
      } else {
        setTableLoading(false);
      }
    }
  }, []);

  // Handle filter changes with debouncing for search
  useEffect(() => {
    const isSearchChange = previousFiltersRef.current.search !== filters.search;

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (isSearchChange) {
      // Debounce search queries
      searchTimeoutRef.current = setTimeout(() => {
        fetchReport(filters);
      }, SEARCH_DEBOUNCE_MS);
    } else {
      // Apply other filters immediately
      fetchReport(filters);
    }

    previousFiltersRef.current = filters;

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [filters, fetchReport]);

  const updateFilters = useCallback((newFilters: Partial<FinancialFilters>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({});
  }, []);

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
    tableLoading,
    error,
    filters,
    updateFilters,
    resetFilters,
    refreshReport: () => fetchReport(filters),
    exportReport
  };
};