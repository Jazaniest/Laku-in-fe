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
   * Send voice transcript text to AI endpoint
   */
  async sendVoiceMessage(transcript: string): Promise<VoiceResponse> {
    try {
      console.log('🎤 Mengirim voice message ke endpoint:', transcript);

      // Clean up transcript
      const trimmedTranscript = transcript.trim();
      
      if (!trimmedTranscript || trimmedTranscript.length === 0) {
        return {
          type: 'error',
          data: { error: 'Transcript kosong terdeteksi' }
        };
      }

      console.log('📝 Processing cleaned transcript:', trimmedTranscript);
      console.log('🤖 Sending to AI endpoint...');

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
   * Process voice command with AI endpoint
   */
  private async processWithAI(transcript: string): Promise<VoiceResponse> {
    try {
      // Create completion request
      const completionRequest = {
        messages: [
          {
            role: 'user' as const,
            content: transcript // Send the transcript text directly to API
          }
        ],
        temperature: 0.3,
        max_tokens: 100
      };

      // Send to API endpoint
      const completionResponse: KolosalCompletionResponse = await kolosalAPIClient.sendCompletion(completionRequest);

      // Validate response
      if (!completionResponse.success || !completionResponse.data?.choices?.[0]?.message) {
        return {
          type: 'error',
          data: { error: 'Response dari AI endpoint tidak valid' }
        };
      }

      const aiMessage = completionResponse.data.choices[0].message.content.trim();
      
      if (!aiMessage) {
        return {
          type: 'error',
          data: { error: 'Tidak ada response yang diterima dari AI endpoint' }
        };
      }

      console.log('🤖 AI Endpoint Response:', aiMessage);

      return {
        type: 'text',
        data: { message: aiMessage }
      };
    } catch (error) {
      console.error('❌ Error processing with AI endpoint:', error);
      throw error;
    }
  }

  /**
   * Initialize voice service
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