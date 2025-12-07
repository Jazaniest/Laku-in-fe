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
 * Simplified Voice Service for initial implementation
 */
export class VoiceService {
  /**
   * Send voice message to AI
   */
  async sendVoiceMessage(transcript: string): Promise<VoiceResponse> {
    try {
      console.log('🎤 Mengirim voice message:', transcript);

      // Clean up transcript
      const trimmedTranscript = transcript.trim();
      
      if (!trimmedTranscript || trimmedTranscript.length === 0) {
        return {
          type: 'error',
          data: { error: 'Transcript kosong terdeteksi' }
        };
      }

      console.log('📝 Processing cleaned transcript:', trimmedTranscript);
      console.log('🤖 Sending to AI for processing...');

      // Send to AI for processing
      return await this.processWithAI(trimmedTranscript);
    } catch (error) {
      console.error('❌ Error in sendVoiceMessage:', error);
      return {
        type: 'error',
        data: { error: 'Error memproses transkripsi' }
      };
    }
  }

  /**
   * Process voice command with Kolosal AI
   */
  private async processWithAI(transcript: string): Promise<VoiceResponse> {
    try {
      // Create completion request
      const completionRequest = {
        messages: [
          {
            role: 'user' as const,
            content: `Berikan respons untuk perintah ini: ${transcript}. Pastikan response-nya adalah JSON dengan format: {"action": "redirect", "response": {"url": "/nama-halaman"}} atau {"action": "text", "response": {"message": "pesan"}}`
          }
        ],
        temperature: 0.3,
        max_tokens: 100
      };

      // Send to Kolosal API
      const completionResponse: KolosalCompletionResponse = await kolosalAPIClient.sendCompletion(completionRequest);

      // Validate response
      if (!completionResponse.success || !completionResponse.data?.choices?.[0]?.message) {
        return {
          type: 'error',
          data: { error: 'Response dari Kolosal AI tidak valid' }
        };
      }

      const aiMessage = completionResponse.data.choices[0].message.content.trim();
      
      if (!aiMessage) {
        return {
          type: 'error',
          data: { error: 'Tidak ada teks yang diterima dari AI' }
        };
      }

      console.log('🤖 AI Response:', aiMessage);

      // Try to parse JSON response
      try {
        const response = JSON.parse(aiMessage);
        
        if (response.action === 'navigate' || response.action === 'redirect') {
          return {
            type: 'navigate',
            data: { path: response.response?.url || response.response?.page }
          };
        } else if (response.action === 'text') {
          return {
            type: 'text',
            data: { message: response.response?.message }
          };
        } else {
          return {
            type: 'text',
            data: { message: aiMessage }
          };
        }
      } catch {
        // If not JSON, return as text
        return {
          type: 'text',
          data: { message: aiMessage }
        };
      }
    } catch (error) {
      console.error('❌ Error processing with AI:', error);
      throw error;
    }
  }

  /**
   * Initialize voice recognition
   */
  async initialize(): Promise<boolean> {
    try {
      console.log('🎤 Inisialisasi Voice Service...');
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize voice service:', error);
      return false;
    }
  }
}

export const voiceService = new VoiceService();