import React, { useState, useRef, useEffect } from 'react';
import { Mic, Send } from 'lucide-react';
import type { SpeechRecognitionEvent, SpeechRecognitionErrorEvent, SpeechRecognition } from '@/types/voice';

// Simulasi service (nanti ganti dengan import dari service/voiceData.ts)
const sendVoiceMessage = async (text: string) => {
  // Simulasi API call
  console.log('Mengirim ke backend:', text);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, message: 'Pesan terkirim' });
    }, 1000);
  });
};

const VoiceChat: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');

  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Initialize speech recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || (window as unknown as { webkitSpeechRecognition: SpeechRecognition }).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError('Browser tidak mendukung voice recognition');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'id-ID';

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalText = '';
      
      for (let i = 0; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalText += result[0].transcript;
        }
      }

      if (finalText) {
        setTranscript(finalText);
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error);
      setError('Gagal merekam suara');
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // Toggle recording
  const toggleRecording = () => {
    if (!recognitionRef.current) {
      setError('Speech recognition tidak tersedia');
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      setTranscript('');
      setError('');
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (err) {
        setError('Gagal memulai rekaman, ' + err);
      }
    }
  };

  // Send message to backend
  const sendMessage = async () => {
    if (!transcript.trim()) return;

    setIsSending(true);
    setError('');

    try {
      await sendVoiceMessage(transcript);
      setTranscript(''); // Clear after send
    } catch (err) {
      setError('Gagal mengirim pesan, ' + err);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      {/* Live Transcript - Tampil saat recording */}
      {isRecording && transcript && (
        <div className="bg-linear-to-r from-blue-50 to-indigo-50 rounded-lg shadow-lg p-4 max-w-xs animate-in slide-in-from-bottom border-2 border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
            <span className="text-xs text-blue-600 font-medium">🎤 Mendengarkan...</span>
          </div>
          <p className="text-gray-800 text-sm leading-relaxed">{transcript}</p>
        </div>
      )}

      {/* Final Transcript - Tampil setelah recording selesai */}
      {!isRecording && transcript && (
        <div className="bg-white rounded-lg shadow-lg p-4 max-w-xs animate-in slide-in-from-bottom">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-500">Hasil Rekaman:</span>
            <button
              onClick={sendMessage}
              disabled={isSending}
              className="flex items-center gap-1 bg-blue-500 text-white text-xs px-3 py-1 rounded-full hover:bg-blue-600 disabled:bg-gray-400 transition-colors"
            >
              {isSending ? (
                <span>Mengirim...</span>
              ) : (
                <>
                  <Send className="w-3 h-3" />
                  <span>Kirim</span>
                </>
              )}
            </button>
          </div>
          <p className="text-gray-800 text-sm">{transcript}</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 text-red-700 rounded-lg shadow-lg p-3 max-w-xs">
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Voice Button */}
      <button
        onClick={toggleRecording}
        disabled={isSending}
        className={`
          w-16 h-16 rounded-full flex items-center justify-center
          transition-all duration-200 shadow-lg
          ${isRecording 
            ? 'bg-red-500 animate-pulse' 
            : 'bg-blue-500 hover:bg-blue-600'
          }
          disabled:bg-gray-400 disabled:cursor-not-allowed
        `}
        aria-label={isRecording ? 'Stop Recording' : 'Start Recording'}
      >
        <Mic className={`w-7 h-7 text-white ${isRecording ? 'animate-pulse' : ''}`} />
        
        {isRecording && (
          <div className="absolute inset-0 border-4 border-red-300 rounded-full animate-ping"></div>
        )}
      </button>

      {/* Recording Indicator */}
      {isRecording && (
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-red-500 text-white text-xs px-3 py-1 rounded-full whitespace-nowrap">
          🔴 Merekam...
        </div>
      )}
    </div>
  );
};

export default VoiceChat;