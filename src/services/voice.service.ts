import type { KolosalCompletionResponse } from '@/types/kolosal-api.types';
import { kolosalAPIClient } from './kolosal-api.client';

interface VoiceResponse {
  type: 'text' | 'navigate' | 'error';
  data: {
    message?: string;
    path?: string;
    error?: string;
  };
}

export type { VoiceResponse };

/**
 * Voice Service using Kolosal AI endpoint
 */
export class VoiceService {
  /**
   * Send voice transcript text to AI
   */
  async sendVoiceMessage(transcript: string): Promise<VoiceResponse> {
    try {
      // Clean up transcript
      const trimmedTranscript = transcript.trim();
      
      if (!trimmedTranscript || trimmedTranscript.length === 0) {
        return {
          type: 'error',
          data: { error: 'Transcript kosong terdeteksi' }
        };
      }

      // Send to AI for processing
      return await this.processWithAI(trimmedTranscript);
    } catch (error) {
      console.error('❌ Error in sendVoiceMessage:', error);
      // Fallback to simple response
      if (this.isNavigationCommand(transcript)) {
        const path = this.extractNavigationPath(transcript);
        return {
          type: 'navigate',
          data: { path, message: `Berhasil menuju ${path}` }
        };
      }
      
      return {
        type: 'text',
        data: { message: 'Saya mengerti perintah Anda.' }
      };
    }
  }

  /**
   * Process voice command with AI endpoint
   */
  private async processWithAI(transcript: string): Promise<VoiceResponse> {
    try {
      // Create completion request
      const completionRequest = {
        messages: [
          {
            role: 'user' as const,
            content: `Tentukan tipe response untuk perintah berikut: "${transcript}". 
            Kembalikan dalam format JSON: {"type": "text|navigate|error", "response": "pesan atau path"}
            
            Aturan:
            - "text" untuk pesan umum yang dipahami
            - "navigate" untuk perintah navigasi (mengandung kata seperti "pergi ke", "navigasi ke", "buka halaman", "go to")
            - "error" untuk perintah yang tidak dapat diproses
            
            Contoh response:
            - Input: "go to dashboard" -> {"type": "navigate", "response": "/dashboard"}
            - Input: "apa kabar" -> {"type": "text", "response": "Baik, terima kasih!"}
            - Input: "asdfasdf" -> {"type": "error", "response": "Maaf, saya tidak mengerti perintah tersebut"}`
          }
        ],
        temperature: 0.3,
        max_tokens: 100
      };

      // Send to API endpoint
      const completionResponse: KolosalCompletionResponse = await kolosalAPIClient.sendCompletion(completionRequest);

      // Validate response
      if (!completionResponse.success || !completionResponse.data?.choices?.[0]?.message) {
        throw new Error('Response dari AI tidak valid');
      }

      const aiMessage = completionResponse.data.choices[0].message.content.trim();
      console.log('🤖 AI Response:', aiMessage);

      // Parse JSON response dari AI
      try {
        const aiJson = JSON.parse(aiMessage);
        return {
          type: aiJson.type,
          data: { 
            message: aiJson.response,
            path: aiJson.type === 'navigate' ? aiJson.response : undefined
          }
        };
      } catch {
        // Jika bukan JSON, berikan response umum
        return {
          type: 'text',
          data: { message: aiMessage }
        };
      }
    } catch (error) {
      console.error('❌ Error processing with AI endpoint:', error);
      throw error;
    }
  }

  /**
   * Check if transcript contains navigation commands
   */
  private isNavigationCommand(transcript: string): boolean {
    const navigationKeywords = ['navigate', 'go to', 'open', 'show', 'buka', 'pergi ke', 'tampilkan'];
    const lowerTranscript = transcript.toLowerCase();
    return navigationKeywords.some(keyword => lowerTranscript.includes(keyword));
  }

  /**
   * Extract navigation path from transcript
   */
  private extractNavigationPath(transcript: string): string {
    const lowerTranscript = transcript.toLowerCase();
    if (lowerTranscript.includes('dashboard')) return '/dashboard';
    if (lowerTranscript.includes('analytics') || lowerTranscript.includes('analisis')) return '/dashboard/analytics';
    if (lowerTranscript.includes('report') || lowerTranscript.includes('laporan')) return '/dashboard/reports';
    return '/dashboard';
  }

  /**
   * Initialize voice service
   */
  async initialize(): Promise<boolean> {
    try {
      console.log('🎤 Inisialisasi Voice Service...');
      // Check konfigurasi API
      const apiUrl = import.meta.env.VITE_KOLOSAL_API_URL || 'https://api.kolosal.dev/v1/completions';
      const apiKey = import.meta.env.VITE_KOLOSAL_API_KEY;
      
      if (!apiKey || !apiUrl) {
        console.warn('Konfigurasi AI tidak tersedia');
      }
      
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize voice service:', error);
      return false;
    }
  }
}

export const voiceService = new VoiceService();