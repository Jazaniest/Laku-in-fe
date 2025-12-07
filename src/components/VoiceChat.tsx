// components/VoiceChat.tsx

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Mic, Loader } from 'lucide-react';
import { voiceService } from '@/services/voice.service';
import type { VoiceResponse } from '@/services/voice.service';

const VoiceChat: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [messages, setMessages] = useState<Array<{
    id: string;
    type: 'user' | 'ai';
    message: string;
    timestamp: number;
  }>>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showStatus, setShowStatus] = useState(false);
  const processingTimeoutRef = useRef<number | undefined>(undefined);

  const addMessage = useCallback((type: 'user' | 'ai', message: string) => {
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      type,
      message,
      timestamp: Date.now()
    }]);
  }, []);

  const sendCommand = useCallback(async (transcript: string) => {
    setIsProcessing(true);
    setShowStatus(true);
    
    // Add user message
    addMessage('user', transcript);
    setCurrentTranscript('');
    
    try {
      // Simulate processing timeout
      processingTimeoutRef.current = setTimeout(() => {
        setShowStatus(false);
      }, 1000) as number;

      const response: VoiceResponse = await voiceService.sendVoiceMessage(transcript);
      
      // Handle response based on type
      if (response.type === 'text' && response.data.message) {
        addMessage('ai', response.data.message);
      } else {
        addMessage('ai', 'Saya telah menerima perintah Anda. Silakan cek navigasi.');
      }
    } catch (error) {
      console.error('Error sending command:', error);
      addMessage('ai', 'Terjadi kesalahan saat memproses perintah Anda.');
    } finally {
      setIsProcessing(false);
      clearTimeout(processingTimeoutRef.current);
      setShowStatus(false);
    }
  }, [addMessage]);

  const handleStartRecording = useCallback(() => {
    if (isProcessing) return;

    // Mock recording
    setIsRecording(true);

    // Simulate recording with timeout
    setTimeout(() => {
      setIsRecording(false);
    }, 2000);

    // Mock transcript
    setTimeout(() => {
      const mockTranscript = 'Tampilkan halaman laporan finansial';
      setCurrentTranscript(mockTranscript);
      sendCommand(mockTranscript);
    }, 2500);
  }, [isProcessing, sendCommand]);

  useEffect(() => {
    return () => {
      clearTimeout(processingTimeoutRef.current);
    };
  }, []);

  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="fixed right-4 top-1/2 transform -translate-y-1/2 p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-50"
        title="Buka Voice Chat"
      >
        <Mic className="w-5 h-5" />
      </button>
    );
  }

  return (
    <div className="fixed right-4 top-1/2 transform -translate-y-1/2 w-80 bg-white rounded-lg shadow-xl z-50">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-800">Voice Command</h3>
        <button
          onClick={() => setIsExpanded(false)}
          className="p-1 hover:bg-gray-100 rounded"
          title="Tutup"
        >
          <div className="w-4 h-1 bg-gray-400 rounded-full" />
        </button>
      </div>

      {/* Status */}
      <div className="px-3 py-2 border-b border-gray-200">
        <div className="text-xs text-gray-600 mb-2">{isProcessing ? 'Processing command...' : 'Ready for your command'}</div>
        
        {showStatus && (
          <div className="flex items-center space-x-2 bg-blue-50 p-2 rounded">
            <Loader className="w-4 h-4 text-blue-500 animate-spin" />
            <span className="text-xs text-blue-700">Processing...</span>
          </div>
        )}

        {currentTranscript && (
          <div className="mt-2 p-2 bg-gray-50 rounded text-xs text-gray-700">
            <strong>Transcript:</strong> {currentTranscript}
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto max-h-48 p-3 space-y-2">
        {messages.length === 0 ? (
          <p className="text-xs text-gray-500 text-center">No messages yet. Try recording a command.</p>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`p-2 rounded text-xs ${
                msg.type === 'user'
                  ? 'bg-blue-100 ml-auto max-w-[80%]'
                  : 'bg-gray-100 mr-auto max-w-[80%]'
              }`}
            >
              {msg.message}
            </div>
          ))
        )}
      </div>

      {/* Record Button */}
      <div className="p-3 border-t border-gray-200">
        <button
          onClick={handleStartRecording}
          disabled={isProcessing || isRecording}
          className={`w-full flex items-center justify-center space-x-2 py-2 px-3 text-black rounded text-sm transition-colors ${
            isRecording
              ? 'bg-red-500 text-white'
              : isProcessing
              ? 'bg-gray-200 text-gray-500'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          <Mic className="w-4 h-4" />
          <span>{isRecording ? 'Recording...' : isProcessing ? 'Processing...' : 'Record Command'}</span>
        </button>
      </div>

      {/* Help Text */}
      <div className="px-3 pb-2">
        <p className="text-xs text-gray-500">Try commands like: "Tampilkan dashboard" or "Bagaimana kondisi keuangan saya?"</p>
      </div>
    </div>
  );
};

export default VoiceChat;