import { useState } from 'react';
import type { GeneratedPoster, PosterEditData } from '@/types/poster.types';
import { posterService } from '@/services/poster.service';

interface UsePosterGeneratorReturn {
  uploading: boolean;
  processing: boolean;
  currentPoster: GeneratedPoster | null;
  error: string | null;
  uploadAndGenerate: (file: File, style?: string, template?: string) => Promise<GeneratedPoster>;
  confirmAndSave: (adjustments?: Partial<PosterEditData>) => Promise<{ success: boolean; downloadUrl: string }>;
  retryGeneration: () => Promise<GeneratedPoster>;
  downloadPoster: () => Promise<string>;
  reset: () => void;
}

export const usePosterGenerator = (): UsePosterGeneratorReturn => {
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [currentPoster, setCurrentPoster] = useState<GeneratedPoster | null>(null);
  const [error, setError] = useState<string | null>(null);

  const uploadAndGenerate = async (file: File, style?: string, template?: string): Promise<GeneratedPoster> => {
    try {
      setUploading(true);
      setProcessing(true);
      setError(null);

      const poster = await posterService.uploadAndGeneratePoster(file, style, template);
      setCurrentPoster(poster);

      if (poster.status === 'failed') {
        const errorMsg = typeof poster.errorMessage === 'string' ? poster.errorMessage : 'Generasi gagal';
        setError(errorMsg);
      }

      return poster;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Gagal upload dan generate poster';
      setError(errorMessage);
      throw err;
    } finally {
      setUploading(false);
      setProcessing(false);
    }
  };

  const confirmAndSave = async (adjustments?: Partial<PosterEditData>): Promise<{ success: boolean; downloadUrl: string }> => {
    if (!currentPoster || !currentPoster.editedData) {
      throw new Error('No poster data to confirm');
    }

    try {
      setProcessing(true);
      const result = await posterService.confirmAndSavePoster(
        currentPoster.id,
        currentPoster.editedData,
        adjustments
      );
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Gagal menyimpan poster';
      setError(errorMessage);
      throw err;
    } finally {
      setProcessing(false);
    }
  };

  const retryGeneration = async (): Promise<GeneratedPoster> => {
    if (!currentPoster) {
      throw new Error('No poster to retry');
    }

    try {
      setProcessing(true);
      setError(null);
      const retried = await posterService.retryGeneration(currentPoster.id);
      setCurrentPoster(retried);
      return retried;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Gagal retry generasi';
      setError(errorMessage);
      throw err;
    } finally {
      setProcessing(false);
    }
  };

  const downloadPoster = async (): Promise<string> => {
    if (!currentPoster) {
      throw new Error('No poster to download');
    }

    try {
      setProcessing(true);
      const downloadUrl = await posterService.downloadPoster(currentPoster.id);
      return downloadUrl;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Gagal download poster';
      setError(errorMessage);
      throw err;
    } finally {
      setProcessing(false);
    }
  };

  const reset = (): void => {
    setCurrentPoster(null);
    setError(null);
    setUploading(false);
    setProcessing(false);
  };

  return {
    uploading,
    processing,
    currentPoster,
    error,
    uploadAndGenerate,
    confirmAndSave,
    retryGeneration,
    downloadPoster,
    reset
  };
};
