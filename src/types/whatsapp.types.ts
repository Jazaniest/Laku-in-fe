// ==========================================
// FILE: src/types/whatsapp.types.ts
// ==========================================

export interface WhatsAppStatus {
  connected: boolean;
  phoneNumber?: string;
  profileName?: string;
  lastConnected?: Date;
}

export interface WhatsAppProfile {
  phoneNumber: string;
  profileName: string;
  profilePicture?: string;
}

export interface WhatsAppChat {
  id: string;
  name: string;
  lastMessage?: string;
  lastMessageTime?: Date;
  unreadCount: number;
  isGroup: boolean;
  profilePicture?: string;
}

export interface WhatsAppMessage {
  id: string;
  chatId: string;
  fromMe: boolean;
  message: string;
  timestamp: Date;
  status?: 'pending' | 'sent' | 'delivered' | 'read';
  type: 'text' | 'image' | 'document' | 'audio' | 'video';
}

export interface SendMessageRequest {
  number: string;
  message: string;
}

export interface SendMessageResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}