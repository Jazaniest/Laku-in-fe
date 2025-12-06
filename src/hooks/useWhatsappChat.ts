// ==========================================
// FILE: src/hooks/useWhatsAppChat.ts
// ==========================================

import { useState, useEffect, useCallback } from 'react';
import type { WhatsAppChat, WhatsAppMessage, SendMessageRequest } from '@/types/whatsapp.types';
import { whatsappService } from '@/services/whatsapp.service';

export const useWhatsAppChat = () => {
  const [chats, setChats] = useState<WhatsAppChat[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<WhatsAppMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchChats = useCallback(async () => {
    try {
      setLoading(true);
      const chatList = await whatsappService.getChats();
      setChats(chatList);
      setError(null);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch chats';
      setError(errorMessage);
      console.error('Fetch chats error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMessages = useCallback(async (chatId: string) => {
    try {
      setLoading(true);
      const msgList = await whatsappService.getMessages(chatId);
      setMessages(msgList);
      setError(null);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch messages';
      setError(errorMessage);
      console.error('Fetch messages error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const selectChat = useCallback((chatId: string) => {
    setSelectedChatId(chatId);
    fetchMessages(chatId);
  }, [fetchMessages]);

  const sendMessage = useCallback(async (request: SendMessageRequest) => {
    try {
      setSending(true);
      const result = await whatsappService.sendMessage(request);
      
      if (result.success && selectedChatId) {
        // Refresh messages after sending
        await fetchMessages(selectedChatId);
      }
      
      return result;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send message';
      setError(errorMessage);
      throw err;
    } finally {
      setSending(false);
    }
  }, [selectedChatId, fetchMessages]);

  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  return {
    chats,
    selectedChatId,
    messages,
    loading,
    sending,
    error,
    selectChat,
    sendMessage,
    refreshChats: fetchChats,
    refreshMessages: () => selectedChatId && fetchMessages(selectedChatId)
  };
};