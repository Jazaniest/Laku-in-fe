import type {
  WhatsAppStatus,
  WhatsAppProfile,
  WhatsAppChat,
  WhatsAppMessage,
  SendMessageRequest,
  SendMessageResponse
} from '@/types/whatsapp.types';

// API Configuration
// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const API_BASE_URL = 'http://localhost:3001';
const WA_API_BASE = `${API_BASE_URL}/whatsapp`;

class WhatsAppService {
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Request new QR code
  async requestQR(): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${WA_API_BASE}/request-qr`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to request QR code');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Request QR error:', error);
      throw error;
    }
  }

  // Get QR code as string
  async getQRString(): Promise<string> {
    try {
      const response = await fetch(`${WA_API_BASE}/qr`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to get QR string');
      }

      const data = await response.json();
      return data.qr;
    } catch (error) {
      console.error('Get QR string error:', error);
      throw error;
    }
  }

  // Get QR code as base64 image
  async getQRBase64(): Promise<string> {
    try {
      const response = await fetch(`${WA_API_BASE}/qr-base64`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to get QR base64');
      }

      const data = await response.json();
      return data.qrBase64;
    } catch (error) {
      console.error('Get QR base64 error:', error);
      throw error;
    }
  }

  // Get connection status
  async getStatus(): Promise<WhatsAppStatus> {
    try {
      const response = await fetch(`${WA_API_BASE}/status`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to get status');
      }

      const data = await response.json();
      return {
        connected: data.connected,
        phoneNumber: data.phoneNumber,
        profileName: data.profileName,
        lastConnected: data.lastConnected ? new Date(data.lastConnected) : undefined
      };
    } catch (error) {
      console.error('Get status error:', error);
      throw error;
    }
  }

  // Get profile information
  async getProfile(): Promise<WhatsAppProfile> {
    try {
      const response = await fetch(`${WA_API_BASE}/profile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to get profile');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  }

  // Get list of chats
  async getChats(): Promise<WhatsAppChat[]> {
    try {
      const response = await fetch(`${WA_API_BASE}/chats`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to get chats');
      }

      const data = await response.json();
      return data.chats.map((chat: WhatsAppChat & { lastMessageTime?: string | Date }) => ({
        ...chat,
        lastMessageTime: chat.lastMessageTime ? new Date(chat.lastMessageTime) : undefined
      }));
    } catch (error) {
      console.error('Get chats error:', error);
      throw error;
    }
  }

  // Get messages from specific chat
  async getMessages(chatId: string): Promise<WhatsAppMessage[]> {
    try {
      const response = await fetch(`${WA_API_BASE}/messages?chatId=${encodeURIComponent(chatId)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to get messages');
      }

      const data = await response.json();
      return data.messages.map((msg: WhatsAppMessage & { timestamp: string | Date }) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }));
    } catch (error) {
      console.error('Get messages error:', error);
      throw error;
    }
  }

  // Send message
  async sendMessage(request: SendMessageRequest): Promise<SendMessageResponse> {
    try {
      const response = await fetch(`${WA_API_BASE}/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Send message error:', error);
      throw error;
    }
  }

  // Disconnect WhatsApp
  async disconnect(): Promise<{ success: boolean }> {
    try {
      const response = await fetch(`${WA_API_BASE}/disconnect`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to disconnect');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Disconnect error:', error);
      throw error;
    }
  }

  // Poll status (for checking connection changes)
  async pollStatus(
    onStatusChange: (status: WhatsAppStatus) => void,
    intervalMs: number = 3000
  ): Promise<() => void> {
    let isPolling = true;

    const poll = async () => {
      while (isPolling) {
        try {
          const status = await this.getStatus();
          onStatusChange(status);
        } catch (error) {
          console.error('Poll status error:', error);
        }
        await this.delay(intervalMs);
      }
    };

    poll();

    // Return cleanup function
    return () => {
      isPolling = false;
    };
  }
}

export const whatsappService = new WhatsAppService();