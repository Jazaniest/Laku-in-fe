import { useState, useEffect, useCallback } from 'react';
import type { ReceiptHistory } from '@/types/receipt.types';
import { receiptService } from '@/services/receipt.service';

interface UseReceiptHistoryReturn {
  data: ReceiptHistory[];
  loading: boolean;
  error: string | null;
  refreshHistory: () => Promise<void>;
  deleteReceipt: (receiptId: string) => Promise<void>;
}

export const useReceiptHistory = (): UseReceiptHistoryReturn => {
  const [data, setData] = useState<ReceiptHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      const history = await receiptService.getReceiptHistory();
      setData(history);
      setError(null);
    } catch (err) {
      setError('Gagal memuat riwayat upload');
      console.error('Receipt history fetch error:', err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const deleteReceipt = async (receiptId: string): Promise<void> => {
    try {
      await receiptService.deleteReceipt(receiptId);
      setData(prev => prev.filter(h => h.receipt.id !== receiptId));
    } catch (err) {
      console.error('Delete receipt error:', err instanceof Error ? err.message : 'Unknown error');
      throw err;
    }
  };

  return {
    data,
    loading,
    error,
    refreshHistory: fetchHistory,
    deleteReceipt
  };
};