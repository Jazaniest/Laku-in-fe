// ==========================================
// FILE: src/hooks/useWhatsApp.ts
// ==========================================

import { useState, useEffect, useCallback } from 'react';
import type { WhatsAppStatus } from '@/types/whatsapp.types';
import { whatsappService } from '@/services/whatsapp.service';

export const useWhatsApp = () => {
  const [status, setStatus] = useState<WhatsAppStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = useCallback(async () => {
    try {
      setLoading(true);
      const waStatus = await whatsappService.getStatus();
      setStatus(waStatus);
      setError(null);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch WhatsApp status';
      setError(errorMessage);
      console.error('WhatsApp status error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();

    // Poll status every 5 seconds
    const cleanup = whatsappService.pollStatus((newStatus) => {
      setStatus(newStatus);
    }, 5000);

    return () => {
      cleanup.then(stopPolling => stopPolling());
    };
  }, [fetchStatus]);

  const disconnect = async () => {
    try {
      setLoading(true);
      await whatsappService.disconnect();
      await fetchStatus();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to disconnect';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    status,
    loading,
    error,
    refreshStatus: fetchStatus,
    disconnect
  };
};