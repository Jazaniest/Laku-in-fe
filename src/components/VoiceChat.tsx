// components/VoiceChat.tsx

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Mic, Loader, Square } from 'lucide-react';
import { voiceService } from '@/services/voice.service';
import type { VoiceResponse } from '@/types/voice.types';
import type { SpeechRecognition, SpeechRecognitionEvent, SpeechRecognitionErrorEvent } from '@/types/voice.types';

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
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const processingTimeoutRef = useRef<number | undefined>(undefined);

  // Initialize speech recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'id-ID';
      
      recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
        let finalTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        
        if (finalTranscript) {
          setCurrentTranscript(finalTranscript);
        }
      };
      
      recognitionInstance.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
      };
      
      recognitionInstance.onend = () => {
        setIsRecording(false);
      };
      
      setRecognition(recognitionInstance);
    } else {
      console.warn('Speech recognition not supported in this browser');
    }
  }, []);

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
    if (isProcessing || !recognition) return;
    
    setIsRecording(true);
    setCurrentTranscript('');
    
    try {
      recognition.start();
    } catch (error) {
      console.error('Error starting recognition:', error);
      setIsRecording(false);
      // Tampilkan pesan error ke user
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        type: 'ai',
        message: 'Maaf, terjadi kesalahan saat memulai perekaman suara.',
        timestamp: Date.now()
      }]);
    }
  }, [isProcessing, recognition]);

  const handleStopRecording = useCallback(() => {
    if (recognition && isRecording) {
      recognition.stop();
      setIsRecording(false);
    }
  }, [recognition, isRecording]);

  // Process transcript when recording ends
  useEffect(() => {
    if (!isRecording && currentTranscript && !isProcessing) {
      sendCommand(currentTranscript);
    }
  }, [isRecording, currentTranscript, isProcessing]);

  useEffect(() => {
    return () => {
      clearTimeout(processingTimeoutRef.current);
      if (recognition && isRecording) {
        recognition.stop();
      }
    };
  }, [recognition, isRecording]);

  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="fixed bottom-6 right-6 p-3 bg-zinc-500 hover:bg-zinc-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-50"
        title="Buka Voice Chat"
      >
        <Mic className="w-5 h-5" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-80 bg-white rounded-lg shadow-xl z-50">
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
          <div className="flex items-center space-x-2 bg-zinc-50 p-2 rounded">
            <Loader className="w-4 h-4 text-zinc-500 animate-spin" />
            <span className="text-xs text-zinc-700">Processing...</span>
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
                  ? 'bg-zinc-100 ml-auto max-w-[80%]'
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
          onClick={isRecording ? handleStopRecording : handleStartRecording}
          disabled={isProcessing || !recognition}
          className={`w-full flex items-center justify-center space-x-2 py-2 px-3 rounded text-sm transition-colors ${
            isRecording
              ? 'bg-red-500 text-white'
              : isProcessing
              ? 'bg-gray-200 text-gray-500'
              : 'bg-zinc-500 hover:bg-zinc-600 text-white'
          } ${(!recognition || isProcessing) ? ' opacity-50 cursor-not-allowed' : ' cursor-pointer'}`}
        >
          {isRecording ? <Square className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          <span>{isRecording ? 'Stop Recording' : isProcessing ? 'Processing...' : 'Record Command'}</span>
        </button>
        
        {!recognition && (
          <p className="text-xs text-red-600 mt-1">
            Speech recognition not supported in this browser. Use Chrome or Edge.
          </p>
        )}
      </div>

      {/* Help Text */}
      <div className="px-3 pb-2">
        <p className="text-xs text-gray-500">Try commands like: "Tampilkan dashboard" or "Bagaimana kondisi keuangan saya?"</p>
      </div>
    </div>
  );
};

export default VoiceChat;