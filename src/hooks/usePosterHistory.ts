import { useState, useEffect, useCallback } from 'react';
import type { PosterHistory } from '@/types/poster.types';
import { posterService } from '@/services/poster.service';

interface UsePosterHistoryReturn {
  data: PosterHistory[];
  loading: boolean;
  error: string | null;
  refreshHistory: () => Promise<void>;
  deletePoster: (posterId: string) => Promise<void>;
}

export const usePosterHistory = (): UsePosterHistoryReturn => {
  const [data, setData] = useState<PosterHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      const history = await posterService.getPosterHistory();
      setData(history);
      setError(null);
    } catch (err) {
      setError('Gagal memuat riwayat poster');
      console.error('Poster history fetch error:', err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const deletePoster = async (posterId: string): Promise<void> => {
    try {
      await posterService.deletePoster(posterId);
      setData(prev => prev.filter(h => h.poster.id !== posterId));
    } catch (err) {
      console.error('Delete poster error:', err instanceof Error ? err.message : 'Unknown error');
      throw err;
    }
  };

  return {
    data,
    loading,
    error,
    refreshHistory: fetchHistory,
    deletePoster
  };
};
