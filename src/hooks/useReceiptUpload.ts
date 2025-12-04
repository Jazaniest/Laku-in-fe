import { useState } from 'react';
import type { ReceiptUpload, ExtractedReceiptData } from '@/types/receipt.types';
import { receiptService } from '@/services/receipt.service';

interface UseReceiptUploadReturn {
  uploading: boolean;
  processing: boolean;
  currentUpload: ReceiptUpload | null;
  error: string | null;
  uploadReceipt: (file: File) => Promise<ReceiptUpload>;
  confirmReceipt: (adjustments?: Partial<ExtractedReceiptData>) => Promise<{ success: boolean; transactionId: string }>;
  retryUpload: () => Promise<ReceiptUpload>;
  reset: () => void;
}

export const useReceiptUpload = (): UseReceiptUploadReturn => {
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [currentUpload, setCurrentUpload] = useState<ReceiptUpload | null>(null);
  const [error, setError] = useState<string | null>(null);

  const uploadReceipt = async (file: File): Promise<ReceiptUpload> => {
    try {
      setUploading(true);
      setProcessing(true);
      setError(null);

      const upload = await receiptService.uploadReceipt(file);
      setCurrentUpload(upload);

      if (upload.status === 'failed') {
        const errorMsg = typeof upload.errorMessage === 'string' ? upload.errorMessage : 'Upload gagal';
        setError(errorMsg);
      }

      return upload;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Gagal upload receipt';
      setError(errorMessage);
      throw err;
    } finally {
      setUploading(false);
      setProcessing(false);
    }
  };

  const confirmReceipt = async (adjustments?: Partial<ExtractedReceiptData>): Promise<{ success: boolean; transactionId: string }> => {
    if (!currentUpload || !currentUpload.extractedData) {
      throw new Error('No receipt data to confirm');
    }

    try {
      setProcessing(true);
      const result = await receiptService.confirmAndAddToFinancial(
        currentUpload.id,
        currentUpload.extractedData,
        adjustments
      );
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Gagal menambahkan ke laporan keuangan';
      setError(errorMessage);
      throw err;
    } finally {
      setProcessing(false);
    }
  };

  const retryUpload = async (): Promise<ReceiptUpload> => {
    if (!currentUpload) {
      throw new Error('No receipt to retry');
    }

    try {
      setProcessing(true);
      setError(null);
      const retried = await receiptService.retryUpload(currentUpload.id);
      setCurrentUpload(retried);
      return retried;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Gagal retry upload';
      setError(errorMessage);
      throw err;
    } finally {
      setProcessing(false);
    }
  };

  const reset = (): void => {
    setCurrentUpload(null);
    setError(null);
    setUploading(false);
    setProcessing(false);
  };

  return {
    uploading,
    processing,
    currentUpload,
    error,
    uploadReceipt,
    confirmReceipt,
    retryUpload,
    reset
  };
};
