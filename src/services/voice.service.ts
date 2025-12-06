// services/voice.service.ts

import type {
  BackendResponse,
  TextResponse,
  NavigationResponse,
  RouteValidationResult,
  VoiceServiceError as VoiceServiceErrorEnum,
  VoiceError,
  AvailableRoute,
} from '@/types/voice.types';
import {
  isAvailableRoute,
  AVAILABLE_ROUTES,
  VoiceServiceError,
} from '@/types/voice.types';
import {
  createVoiceCommandCompletionRequest,
  parseNavigationResponse,
  type NavigationCommand,
  type KolosalCompletionResponse,
} from '@/types/kolosal-api.types';
import { kolosalAPIClient } from './kolosal-api.client';

/**
 * Voice Service menggunakan Kolosal API untuk chat completion
 * Mengubah voice commands menjadi navigasi atau response teks
 */
class VoiceService {
  private readonly availableRoutes = {
    public: [...AVAILABLE_ROUTES.public],
    protected: [...AVAILABLE_ROUTES.protected],
  };

  /**
   * Mengirim voice message ke Kolosal API untuk chat completion
   */
  async sendVoiceMessage(_audioBlob: Blob, transcript?: string): Promise<BackendResponse> {
    try {
      // Validasi transcript
      if (!transcript || typeof transcript !== 'string') {
        throw this.createError(
          VoiceServiceError.NO_SPEECH_DETECTED,
          'Transcript tidak tersedia atau tidak valid'
        );
      }

      const trimmedTranscript = transcript.trim();
      if (trimmedTranscript.length === 0) {
        throw this.createError(
          VoiceServiceError.NO_SPEECH_DETECTED,
          'Transcript kosong'
        );
      }

      console.log('🎤 Mengirim ke Kolosal API...');
      console.log('📝 Transcript:', trimmedTranscript);

      // Buat completion request
      const completionRequest = createVoiceCommandCompletionRequest(trimmedTranscript);

      // Kirim ke Kolosal API
      const completionResponse: KolosalCompletionResponse = await kolosalAPIClient.sendCompletion(completionRequest);

      // Validasi response
      if (!completionResponse.data?.choices?.[0]?.message?.content) {
        throw this.createError(
          VoiceServiceError.INVALID_RESPONSE,
          'Response dari Kolosal API tidak valid'
        );
      }

      const aiMessage = completionResponse.data.choices[0].message.content.trim();
      
      // Parse dan validasi response
      const navigationCommand: NavigationCommand = parseNavigationResponse(aiMessage);
      
      // Transform ke BackendResponse dengan type safety
      return this.transformCompletionToBackendResponse(navigationCommand);

    } catch (error) {
      console.error('❌ Error in sendVoiceMessage:', error);
      return this.handleError(error);
    }
  }

  /**
   * Transform completion response ke BackendResponse dengan type safety yang ketat
   */
  private transformCompletionToBackendResponse(command: NavigationCommand): BackendResponse {
    if (command.action === 'text') {
      return {
        type: 'text',
        data: {
          message: this.validateTextMessage(command.response.message),
          timestamp: this.validateTimestamp(command.response.timestamp),
        } as TextResponse,
      };
    }

    if (command.action === 'navigation') {
      const targetPath = command.response.path;

      if (!targetPath || typeof targetPath !== 'string') {
        throw this.createError(
          VoiceServiceError.INVALID_RESPONSE,
          'Target path tidak valid'
        );
      }

      // Normalize path
      const normalizedPath = this.normalizePath(targetPath);

      // Validate route dengan tipe yang ketat
      const validation = this.validateRoute(normalizedPath);

      if (!validation.isValid) {
        return {
          type: 'text',
          data: {
            message: this.validateTextMessage(validation.message),
            timestamp: Date.now(),
          },
        };
      }

      // Validasi path adalah AvailableRoute
      if (!this.isValidRoute(normalizedPath)) {
        throw this.createError(
          VoiceServiceError.INVALID_ROUTE,
          `Route "${normalizedPath}" tidak valid`
        );
      }

      return {
        type: 'navigation',
        data: {
          path: normalizedPath as AvailableRoute,
          params: this.validateParams(command.response.params),
          timestamp: this.validateTimestamp(command.response.timestamp),
        } as NavigationResponse,
      };
    }

    throw this.createError(
      VoiceServiceError.INVALID_RESPONSE,
      `Action tidak valid: ${command.action}`
    );
  }

  /**
   * Normalize path untuk konsistensi
   */
  private normalizePath(path: string): string {
    if (typeof path !== 'string') {
      throw this.createError(
        VoiceServiceError.INVALID_ROUTE,
        'Path harus string'
      );
    }

    let normalized = path.toLowerCase().trim();
    
    // Pastikan path dimulai dengan /
    if (!normalized.startsWith('/')) {
      normalized = '/' + normalized;
    }
    
    // Hapus trailing slash kecuali untuk root
    if (normalized.length > 1 && normalized.endsWith('/')) {
      normalized = normalized.slice(0, -1);
    }
    
    return normalized;
  }

  /**
   * Validasi apakah route tersedia
   */
  validateRoute(path: string): RouteValidationResult {
    const normalizedPath = this.normalizePath(path);

    const isPublic = this.availableRoutes.public.some(
      (route) => this.normalizePath(route) === normalizedPath
    );

    const isProtected = this.availableRoutes.protected.some(
      (route) => this.normalizePath(route) === normalizedPath
    );

    if (!isPublic && !isProtected) {
      const availablePages = [
        'Beranda (/)',
        'Autentikasi (/auth)',
        'Dashboard (/dashboard)',
        'Laporan Keuangan (/dashboard/financial-report)',
        'Analitik Bisnis (/dashboard/business-analytics)',
        'Unggah Nota (/dashboard/receipt-upload)',
        'Pembuat Poster (/dashboard/poster-generator)',
      ];

      return {
        isValid: false,
        isProtected: false,
        message: `Halaman "${normalizedPath}" tidak ditemukan. Halaman yang tersedia: ${availablePages.join(', ')}.`,
      };
    }

    return {
      isValid: true,
      isProtected: isProtected,
    };
  }

  /**
   * Validasi apakah path adalah route yang valid
   */
  private isValidRoute(path: string): boolean {
    const normalizedPath = this.normalizePath(path);
    return isAvailableRoute(normalizedPath);
  }

  /**
   * Cek apakah route memerlukan autentikasi
   */
  isProtectedRoute(path: string): boolean {
    try {
      const normalizedPath = this.normalizePath(path);
      return this.availableRoutes.protected.some(
        (route) => this.normalizePath(route) === normalizedPath
      );
    } catch {
      return false;
    }
  }

  /**
   * Get auth token dari cookie atau localStorage
   */
  getAuthToken(): string | null {
    try {
      // Coba cookie dulu
      const cookieToken = document.cookie
        .split('; ')
        .find((row) => row.startsWith('authToken='))
        ?.split('=')[1];

      if (cookieToken) return cookieToken;

      // Fallback ke localStorage
      return localStorage.getItem('authToken');
    } catch {
      return null;
    }
  }

  /**
   * Cek apakah user authenticated
   */
  isAuthenticated(): boolean {
    try {
      const token = this.getAuthToken();
      return !!token && token.length > 0;
    } catch {
      return false;
    }
  }

  /**
   * Validasi message text
   */
  private validateTextMessage(message: unknown): string {
    if (typeof message !== 'string') {
      return 'Tidak ada respons';
    }
    
    const trimmedMessage = message.trim();
    return trimmedMessage.length > 0 ? trimmedMessage : 'Tidak ada respons';
  }

  /**
   * Validasi timestamp
   */
  private validateTimestamp(timestamp: unknown): number {
    if (typeof timestamp === 'number') {
      return timestamp;
    }
    
    return Date.now();
  }

  /**
   * Validasi parameters
   */
  private validateParams(params: unknown) {
    if (typeof params === 'object' && params !== null) {
      return params as Record<string, string | number | boolean>;
    }
    
    return {};
  }

  /**
   * Create structured error
   */
  private createError(code: VoiceServiceErrorEnum, message: string, originalError?: Error): VoiceError {
    return {
      code,
      message,
      originalError,
    };
  }

  /**
   * Handle error dan convert ke BackendResponse
   */
  private handleError(error: unknown): BackendResponse {
    let errorMessage = 'Terjadi kesalahan yang tidak diketahui';

    if (this.isVoiceError(error)) {
      errorMessage = error.message;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'string' && error.length > 0) {
      errorMessage = error;
    }

    return {
      type: 'text',
      data: {
        message: `Maaf, terjadi kesalahan: ${errorMessage}. Silakan coba lagi.`,
        timestamp: Date.now(),
      },
    };
  }

  /**
   * Type guard untuk VoiceError
   */
  private isVoiceError(error: unknown): error is VoiceError {
    return (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      'message' in error
    );
  }
}

export const voiceService = new VoiceService();