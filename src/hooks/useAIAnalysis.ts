import { useState } from 'react';
import { analyticsService } from '@/services/analytics.service';

export const useAIAnalysis = () => {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const askAI = async (question: string) => {
    try {
      setLoading(true);
      setError(null);
      const answer = await analyticsService.requestAIAnalysis(question);
      setResponse(answer);
    } catch (err) {
      setError('Gagal mendapatkan analisis AI');
      console.error('AI analysis error:', err);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setResponse(null);
    setError(null);
  };

  return {
    loading,
    response,
    error,
    askAI,
    reset
  };
};