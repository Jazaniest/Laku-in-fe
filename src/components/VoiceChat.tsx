// components/VoiceChat.tsx

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Mic } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { voiceService } from '@/services/voice.service';
import type {
  SpeechRecognitionEvent,
  SpeechRecognitionErrorEvent,
  SpeechRecognition,
  VoiceResponse,
  BackendResponse,
} from '@/types/voice.types';
import { isTextResponse, isNavigationResponse } from '@/types/voice.types';

const VoiceChat: React.FC = () => {
  const navigate = useNavigate();
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<VoiceResponse[]>([]);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const isStoppingRef = useRef(false);
  const hasFinalResultRef = useRef(false);

  // Initialize speech recognition
  useEffect(() => {
    const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognitionClass) {
      setError('Browser Anda tidak mendukung voice recognition. Gunakan Chrome atau Edge.');
      return;
    }

    const recognition = new SpeechRecognitionClass();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'id-ID';
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      if (!event?.results?.length) return;

      // Simpan index result terakhir yang diproses untuk mencegah duplikasi
      const lastResult = event.results[event.results.length - 1];
      if (!lastResult?.[0]) return;

      const transcriptText = lastResult[0].transcript;

      // Hitung untuk mencegah duplikasi
      if (lastResult.isFinal) {
        hasFinalResultRef.current = true;
        setTranscript(transcriptText.trim());
        
        // Auto-stop recording setelah hasil final
        setTimeout(() => {
          if (isRecording) {
            handleStopRecording();
          }
        }, 200);
      } else {
        // Untuk interim result, hanya update jika belum ada final
        if (!hasFinalResultRef.current) {
          setTranscript(transcriptText.trim());
        }
      }
    };

    recognition.onend = () => {
      // Hanya restart jika sedang recording dan bukan stop yang disengaja
      if (isRecording && !isStoppingRef.current) {
        try {
          recognition.start();
        } catch (e) {
          console.error('Failed to restart recognition:', e);
        }
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (isStoppingRef.current) return;

      const errorMessages: Record<string, string> = {
        'no-speech': 'Tidak ada suara terdeteksi. Silakan coba lagi.',
        'not-allowed': 'Akses mikrofon ditolak. Mohon berikan izin mikrofon.',
        'audio-capture': 'Tidak dapat mengakses mikrofon. Periksa perangkat Anda.',
        network: 'Koneksi bermasalah. Periksa internet Anda.',
        aborted: 'Perekaman dibatalkan.',
      };

     setError(errorMessages[event.error] || 'Gagal merekam suara. Silakan coba lagi.');
      handleStopRecording();
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          console.error('Cleanup error:', e);
        }
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };
  }, [isRecording]);

  // Handle backend response - dengan proper error handling
  const handleResponse = useCallback(
    async (response: BackendResponse) => {
      try {
        if (isTextResponse(response.data)) {
          const newMessage: VoiceResponse = {
            id: `ai_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
            message: response.data.message,
            timestamp: response.data.timestamp,
            type: 'ai',
          };
          setMessages((prev) => [...prev, newMessage]);
        } else if (isNavigationResponse(response.data)) {
          const { path, params } = response.data;

          console.log('🧭 Navigasi ke:', path, 'dengan params:', params);

          // Check authentication
          const isProtected = voiceService.isProtectedRoute(path);
          const isAuthenticated = voiceService.isAuthenticated();

          if (isProtected && !isAuthenticated) {
            // User perlu login
            const loginMessage: VoiceResponse = {
              id: `ai_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
              message:
                'Anda perlu login terlebih dahulu untuk mengakses halaman ini. Mengarahkan ke halaman login...',
              timestamp: Date.now(),
              type: 'ai',
            };
            setMessages((prev) => [...prev, loginMessage]);

            // Redirect ke login dengan return URL
            setTimeout(() => {
              navigate('/auth', {
                state: {
                  returnUrl: path,
                  returnParams: params,
                },
              });
            }, 1500);
          } else {
            // Navigate ke halaman
            const confirmMessage: VoiceResponse = {
              id: `ai_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
              message: `Mengarahkan Anda ke halaman ${path}...`,
              timestamp: Date.now(),
              type: 'ai',
            };
            setMessages((prev) => [...prev, confirmMessage]);

            setTimeout(() => {
              navigate(path, { state: params });
            }, 800);
          }
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Kesalahan tidak diketahui';
        console.error('Error handling response:', err);
        setError(errorMessage);
      }
    },
    [navigate]
  );

  // Start recording
  const handleStartRecording = useCallback(async () => {
    try {
      setError(null);
      
      // Reset transcript state
      setTranscript('');
      hasFinalResultRef.current = false;
      isStoppingRef.current = false;

      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        },
      });

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm',
      });

      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event: BlobEvent) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      // Sederhanakan start recording
      mediaRecorder.start(1000);
      mediaRecorderRef.current = mediaRecorder;
      streamRef.current = stream;

      // Start speech recognition
      if (recognitionRef.current) {
        recognitionRef.current.start();
      }

      setIsRecording(true);
      console.log('🎤 Recording started');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error starting recording';
      console.error('Error starting recording:', errorMessage);

      if (err instanceof DOMException && err.name === 'NotAllowedError') {
        setError('Akses mikrofon ditolak. Mohon berikan izin mikrofon di pengaturan browser.');
      } else {
        setError('Gagal mengakses mikrofon. Pastikan mikrofon terhubung dan berfungsi.');
      }
    }
  }, []);

  // Stop recording dan process message
  const handleStopRecording = useCallback(async () => {
    console.log('🛑 Stopping recording...');
    isStoppingRef.current = true;
    setIsRecording(false);

    // Stop speech recognition
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.error('Error stopping recognition:', e);
      }
    }

    // Proses langsung tanpa promise rumit
    setIsProcessing(true);
    setError(null);

    // Create audio blob
    const audioBlob = new Blob(audioChunksRef.current, {
      type: 'audio/webm',
    });

    // Stop media recorder
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }

    // Stop media stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    // Proses message
    (async () => {
      try {
    console.log('📊 Audio blob size:', audioBlob.size, 'bytes');
        console.log('📝 Final transcript:', transcript);

        // Check if we have transcript
        if (!transcript || transcript.trim().length === 0) {
     setError('Tidak ada suara yang terdeteksi. Silakan coba lagi.');
          return;
        }

        // Add user message
  const userMessage: VoiceResponse = {
       id: `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
 message: transcript.trim(),
      timestamp: Date.now(),
          type: 'user',
        };
   setMessages((prev) => [...prev, userMessage]);

 // Send to backend
        const backendResponse = await voiceService.sendVoiceMessage(audioBlob, transcript);

        // Handle response
        handleResponse(backendResponse);

// Reset
        audioChunksRef.current = [];
 setTranscript('');
        hasFinalResultRef.current = false;
      } catch (err) {
     const errorMessage =
       err instanceof Error ? err.message : 'Error processing voice';
        console.error('Error:', err);
        setError(`Gagal memproses: ${errorMessage}`);
      } finally {
        setIsProcessing(false);
     isStoppingRef.current = false;
      }
    })();
  }, [transcript, handleResponse]);

  // Toggle recording
  const toggleRecording = useCallback(() => {
    if (isRecording) {
      handleStopRecording();
    } else {
      handleStartRecording();
    }
  }, [isRecording, handleStartRecording, handleStopRecording]);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 max-w-md">
      {/* Live Transcript */}
      {isRecording && transcript && (
        <div className="bg-white rounded-2xl shadow-2xl p-4 max-w-sm animate-in slide-in-from-bottom border border-gray-100">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
              <div
className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"
                style={{ animationDelay: '0.2s' }}
              ></div>
        <div
       className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"
    style={{ animationDelay: '0.4s' }}
           ></div>
         </div>
        <span className="text-xs text-gray-500 font-medium">Mendengarkan...</span>
          </div>
         <p className="text-gray-800 text-sm leading-relaxed wrap-break-word">{transcript}</p>
        </div>
      )}

      {/* Processing Indicator */}
   {isProcessing && (
        <div className="bg-blue-50 rounded-2xl shadow-lg p-4 max-w-sm border border-blue-100">
          <div className="flex items-center gap-3">
    <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
     <span className="text-sm text-blue-700 font-medium">Memproses perintah...</span>
      </div>
      </div>
      )}

      {/* Error Message */}
    {error && !isRecording && !isProcessing && (
        <div className="bg-red-50 text-red-700 rounded-2xl shadow-lg p-4 max-w-sm border border-red-100">
         <p className="text-sm leading-relaxed">{error}</p>
<button
            onClick={() => setError(null)}
           className="mt-2 text-xs text-red-600 hover:text-red-800 underline"
          >
            Tutup
          </button>
        </div>
      )}

      {/* Recent Messages (Last 2) */}
      {!isRecording &&
    !isProcessing &&
       !error &&
   messages.slice(-2).map((msg) => (
          <div
         key={msg.id}
      className={`rounded-2xl shadow-lg p-4 max-w-sm animate-in slide-in-from-bottom ${
       msg.type === 'user'
         ? 'bg-blue-500 text-white ml-12'
    : 'bg-white text-gray-800 border border-gray-100'
    }`}
       >
   <p className="text-sm leading-relaxed wrap-break-word">{msg.message}</p>
<span className="text-xs opacity-70 mt-2 block">
 {new Date(msg.timestamp).toLocaleTimeString('id-ID', {
   hour: '2-digit',
        minute: '2-digit',
       })}
     </span>
        </div>
      ))}

      {/* Voice Button */}
      <div className="relative">
   <button
       onClick={toggleRecording}
     disabled={isProcessing}
          className={`
       w-16 h-16 rounded-full flex items-center justify-center
        transition-all duration-300 shadow-lg hover:shadow-xl
           ${
        isRecording
        ? 'bg-red-500 hover:bg-red-600 scale-110'
         : 'bg-linear-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
       }
    ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}
        disabled:opacity-50 disabled:cursor-not-allowed
 focus:outline-none focus:ring-4 focus:ring-blue-300
     `}
   aria-label={isRecording ? 'Stop Recording' : 'Start Recording'}
        >
          <Mic className="w-7 h-7 text-white" />

 {/* Recording Pulse Effect */}
 {isRecording && (
    <>
   <div className="absolute inset-0 border-4 border-red-400 rounded-full animate-ping opacity-75"></div>
  <div className="absolute inset-0 border-2 border-red-300 rounded-full animate-pulse"></div>
            </>
     )}
   </button>

        {/* Recording Indicator Badge */}
      {isRecording && (
    <div className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-medium shadow-md animate-pulse">
            REC
          </div>
      )}
      </div>

      {/* Hint Text */}
      {!isRecording && !isProcessing && !error && messages.length === 0 && (
        <div className="text-center">
          <p className="text-xs text-gray-500 mt-2">Tekan untuk berbicara</p>
        </div>
      )}
    </div>
  );
};

export default VoiceChat;