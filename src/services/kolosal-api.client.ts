import type { KolosalCompletionRequest, KolosalCompletionResponse } from '@/types/kolosal-api.types';

export class KolosalAPIClient {
  private readonly REQUEST_TIMEOUT = 30000; // 30 seconds

  /**
   * Enhanced API key validation
   */
  private getApiKey(): string {
    const apiKey = import.meta.env.VITE_KOLOSAL_API_KEY;
    
    if (!apiKey) {
      throw new Error('Kolosal API Key tidak ditemukan. Pastikan VITE_KOLOSAL_API_KEY sudah diatur di file .env.local');
    }
    
    // Validate API key format
    if (!this.isValidApiKey(apiKey)) {
      throw new Error('Format Kolosal API Key tidak valid. Pastikan menggunakan API key yang benar.');
    }
    
    return apiKey;
  }

  private isValidApiKey(apiKey: string): boolean {
    // Basic validation: check for minimum length and format
    if (typeof apiKey !== 'string') return false;
    if (apiKey.length < 10) return false;
    
    // Check for common API key patterns
    const patterns = [
      /^[a-zA-Z0-9]{32,}$/, // Most common format
      /^sk-[a-zA-Z0-9]{48,}$/, // OpenAI-like format
      /^kl-[a-zA-Z0-9]{48,}$/ // Kolosal-like format
    ];
    
    return patterns.some(pattern => pattern.test(apiKey));
  }

  /**
   * Validation for API endpoint
   */
  private getApiUrl(): string {
    const url = import.meta.env.VITE_KOLOSAL_API_URL || 'https://api.kolosal.dev/v1/completions';
    
    // Validate URL format
    try {
      new URL(url);
      
      // Check for required path components
      if (!url.includes('/v1/')) {
        console.warn('API URL should include /v1/ path for Kolosal API');
      }
      
      return url;
    } catch (error) {
      throw new Error(`Invalid API URL format: ${url}. Pastikan URL diawali dengan http:// atau https://, ` + error);
    }
  }

  /**
   * Enhanced API call with better error handling
   */

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
        
        if (error.message.includes('Unauthorized')) {
          throw new Error('API Key tidak valid atau kadaluarsa. Periksa konfigurasi API key Anda.');
        }
        
        if (error.message.includes('insufficient_quota')) {
          throw new Error('Kuota API telah habis. Silakan tambah kuota atau coba lagi nanti.');
        }
        
        if (error.message.includes('rate_limit')) {
          throw new Error('Permintaan terlalu cepat. Silakan tunggu sebentar dan coba lagi.');
        }
        
        if (error.message.includes('model_not_found')) {
          throw new Error('Model yang diminta tidak tersedia. Gunakan model yang valid.');
        }
        
        if (error.message.includes('invalid_request')) {
          throw new Error('Permintaan tidak valid. Periksa format data yang dikirim.');
        }
        
        if (error.message.includes('server_error')) {
          throw new Error('Terjadi kesalahan di server. Silakan coba lagi nanti.');
        }
        
        if (error.message.includes('net::ERR_CONNECTION') || 
            error.message.includes('Failed to fetch') ||
            error.message.includes('network')) {
          throw new Error('Permintaan jaringan gagal. Periksa koneksi internet Anda.');
        }
        
        if (error.message.includes('timeout') || error.name === 'TimeoutError') {
          throw new Error('Request timeout. Silakan coba lagi.');
        }
      }

      throw error;
    }
  }
}

export const kolosalAPIClient = new KolosalAPIClient();