// ==========================================
// FILE: src/hooks/useWhatsAppQR.ts
// ==========================================

import { useState, useCallback } from 'react';
import { whatsappService } from '@/services/whatsapp.service';

export const useWhatsAppQR = () => {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestQR = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Request new QR
      await whatsappService.requestQR();
      
      // Wait a bit for QR to be generated
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Get QR as base64
      const qrBase64 = await whatsappService.getQRBase64();
      setQrCode(qrBase64);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to request QR code';
      setError(errorMessage);
      console.error('Request QR error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshQR = useCallback(async () => {
    try {
      const qrBase64 = await whatsappService.getQRBase64();
      setQrCode(qrBase64);
    } catch (err: unknown) {
      console.error('Refresh QR error:', err);
    }
  }, []);

  return {
    qrCode,
    loading,
    error,
    requestQR,
    refreshQR
  };
};