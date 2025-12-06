import type { KolosalCompletionRequest, KolosalCompletionResponse } from '@/types/kolosal-api.types';

export class KolosalAPIClient {
  private readonly REQUEST_TIMEOUT = 30000; // 30 seconds

  private getApiUrl(): string {
    return import.meta.env.VITE_KOLOSAL_API_URL || 'https://api.kolosal.dev/v1/completions';
  }

  private getApiKey(): string {
    const apiKey = import.meta.env.VITE_KOLOSAL_API_KEY;
    if (!apiKey) {
      throw new Error('Kolosal API Key tidak ditemukan. Pastikan VITE_KOLOSAL_API_KEY sudah diatur di file .env.local');
    }
    return apiKey;
  }

  /**
   * Send completion request to Kolosal API
   */
  async sendCompletion(request: KolosalCompletionRequest): Promise<KolosalCompletionResponse> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.REQUEST_TIMEOUT);

    try {
      const apiUrl = this.getApiUrl();
      const apiKey = this.getApiKey();

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'X-Client-Version': '1.0.0',
        },
        body: JSON.stringify(request),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorData.message || errorMessage;
        } catch {
          const errorText = await response.text();
          if (errorText) errorMessage = errorText;
        }

        throw new Error(`Kolosal API error: ${errorMessage}`);
      }

      const data: KolosalCompletionResponse = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Kolosal API mengembalikan error');
      }

      return data;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Request timeout. Silakan coba lagi.');
        }
        
        if (error.message.includes('Failed to fetch')) {
          throw new Error('Tidak dapat terhubung ke server. Periksa koneksi internet Anda.');
        }
      }

      throw error;
    }
  }
}

export const kolosalAPIClient = new KolosalAPIClient();