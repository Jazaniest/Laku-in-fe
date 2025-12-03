// components/ChatCs.tsx
import { useState, useEffect, useRef, useCallback } from 'react';
import { X, Send, MessageCircle, Mic, MicOff, Volume2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import type { 
  Message, 
  MessageType,
  SpeechRecognition,
  SpeechRecognitionEvent,
  SpeechRecognitionErrorEvent 
} from '@/types/Speech';

const ChatCs = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([
    { type: 'cs', text: 'Halo! Ada yang bisa kami bantu? Tekan tombol mikrofon untuk mengirim pesan suara.' }
  ]);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [speechSupported, setSpeechSupported] = useState<boolean>(true);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [interimTranscript, setInterimTranscript] = useState<string>('');
  const [recordingTime, setRecordingTime] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const synthesisRef = useRef<SpeechSynthesisUtterance | null>(null);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'id-ID';

        recognition.onresult = (event: SpeechRecognitionEvent) => {
          let finalTranscript = '';
          let interim = '';

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript;
            } else {
              interim += transcript;
            }
          }

          if (finalTranscript) {
            setMessage(prev => {
              // Jika ada teks sebelumnya, tambahkan spasi
              const separator = prev && !prev.endsWith(' ') ? ' ' : '';
              return prev + separator + finalTranscript;
            });
            setInterimTranscript('');
          } else {
            setInterimTranscript(interim);
          }
        };

        recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
          setIsProcessing(false);
          stopRecordingTimer();
          
          if (event.error === 'not-allowed') {
            alert('Akses mikrofon tidak diizinkan. Silakan berikan izin akses mikrofon di pengaturan browser.');
          } else if (event.error === 'no-speech') {
            alert('Tidak terdeteksi suara. Pastikan mikrofon berfungsi dan coba lagi.');
          }
        };

        recognition.onend = () => {
          setIsListening(false);
          stopRecordingTimer();
          
          // Auto send jika ada konten
          const finalMessage = message || interimTranscript;
          if (finalMessage.trim() && !isProcessing) {
            setTimeout(() => {
              handleSendMessage();
            }, 300); // Delay sedikit untuk memastikan transkrip final sudah diproses
          } else {
            setInterimTranscript('');
          }
        };

        recognitionRef.current = recognition;
      } catch (error) {
        console.error('Failed to initialize speech recognition:', error);
        setSpeechSupported(false);
      }
    } else {
      setSpeechSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (error) {
          console.log('Speech recognition cleanup error:', error);
        }
      }
      stopRecordingTimer();
    };
  }, []);

  // Speech Synthesis (Text-to-Speech)
  const speakText = useCallback((text: string): void => {
    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        
        const speech = new SpeechSynthesisUtterance(text);
        speech.text = text;
        speech.lang = 'id-ID';
        speech.rate = 1.0;
        speech.volume = 1.0;
        
        speech.onstart = () => setIsSpeaking(true);
        speech.onend = () => setIsSpeaking(false);
        speech.onerror = () => setIsSpeaking(false);
        
        synthesisRef.current = speech;
        window.speechSynthesis.speak(speech);
      } catch (error) {
        console.error('Failed to speak text:', error);
        setIsSpeaking(false);
      }
    }
  }, []);

  // Stop speech when component unmounts or chat closes
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Recording timer
  const startRecordingTimer = () => {
    setRecordingTime(0);
    recordingTimerRef.current = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
  };

  const stopRecordingTimer = () => {
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
    setRecordingTime(0);
  };

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'nearest'
    });
  }, [messages, interimTranscript]);

  const formatRecordingTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startListening = (): void => {
    if (!speechSupported) {
      alert('Browser Anda tidak mendukung fitur voice recognition. Coba gunakan Chrome atau Edge versi terbaru.');
      return;
    }

    if (!recognitionRef.current) {
      console.error('Speech recognition not initialized');
      setSpeechSupported(false);
      return;
    }

    setInterimTranscript('');
    try {
      recognitionRef.current.start();
      setIsListening(true);
      startRecordingTimer();
    } catch (error) {
      console.error('Failed to start speech recognition:', error);
      setIsListening(false);
      
      // Try to restart if already started
      if (error instanceof Error && error.message.includes('already started')) {
        recognitionRef.current.stop();
        setTimeout(() => {
          recognitionRef.current?.start();
          setIsListening(true);
          startRecordingTimer();
        }, 100);
      }
    }
  };

  const stopListening = (): void => {
    if (!recognitionRef.current || !isListening) return;
    
    try {
      setIsProcessing(true);
      recognitionRef.current.stop();
      stopRecordingTimer();
    } catch (error) {
      console.error('Failed to stop speech recognition:', error);
      setIsProcessing(false);
    }
  };

  const toggleListening = (): void => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const clearVoiceInput = (): void => {
    setMessage('');
    setInterimTranscript('');
  };

  const handleSendMessage = (): void => {
    const textToSend = message.trim() || interimTranscript.trim();
    
    if (!textToSend) return;

    // Add user message
    setMessages(prev => [...prev, { 
      type: 'user' as MessageType, 
      text: textToSend 
    }]);
    
    // Clear input
    setMessage('');
    setInterimTranscript('');
    setIsProcessing(false);
    
    // Auto-speak CS response after delay
    setTimeout(() => {
      const responses = [
        'Terima kasih pesan suara Anda telah kami terima. Tim CS kami akan segera menghubungi Anda!',
        'Pesan suara Anda telah dicatat. Mohon tunggu sebentar ya, tim kami sedang memproses.',
        'Kami sudah mendengar pesan Anda. Terima kasih telah menggunakan fitur voice note!',
        'Pertanyaan Anda melalui voice note telah kami terima. Tim kami akan merespons secepatnya.'
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      setMessages(prev => [...prev, { 
        type: 'cs' as MessageType, 
        text: randomResponse 
      }]);
      
      // Auto-speak CS response if chat is open
      if (isOpen && speechSupported && !isSpeaking) {
        speakText(randomResponse);
      }
    }, 800);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setMessage(e.target.value);
  };

  const formatTime = (): string => {
    const now = new Date();
    return now.toLocaleTimeString('id-ID', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Auto send jika user berhenti bicara dan ada transkrip
  useEffect(() => {
    if (!isListening && message.trim() && !isProcessing) {
      const timer = setTimeout(() => {
        handleSendMessage();
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [isListening, message, isProcessing]);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <Card className="w-80 sm:w-96 shadow-2xl border-2 border-zinc-200">
          <CardHeader className="bg-gradient-to-r from-zinc-900 to-zinc-800 text-white rounded-t-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <MessageCircle className="w-5 h-5" />
                  {isSpeaking && (
                    <div className="absolute -top-1 -right-1">
                      <div className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-green-400 opacity-75"></div>
                      <div className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></div>
                    </div>
                  )}
                </div>
                <CardTitle className="text-lg text-white font-semibold">
                  Customer Service
                </CardTitle>
                {isSpeaking && (
                  <Badge variant="secondary" className="animate-pulse ml-2">
                    <Volume2 className="w-3 h-3 mr-1" />
                    <span className="text-xs">Sedang Bicara</span>
                  </Badge>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-zinc-700 hover:text-white transition-colors"
                aria-label="Tutup chat"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <CardDescription className="text-zinc-300 flex items-center gap-2">
              <span className="flex-1">
                {speechSupported 
                  ? "Tekan mikrofon, bicara, lalu lepas untuk kirim" 
                  : "Voice note tidak didukung"}
              </span>
              <span className="text-xs opacity-70">
                {formatTime()}
              </span>
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            {/* Messages Container */}
            <div className="h-64 overflow-y-auto mb-4 space-y-3">
              {messages.map((msg, idx) => (
                <div
                  key={`msg-${idx}`}
                  className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[75%] rounded-lg px-4 py-2 ${
                      msg.type === 'user'
                        ? 'bg-zinc-900 text-white'
                        : 'bg-zinc-100 text-zinc-900'
                    }`}
                  >
                    <p className="text-sm">{msg.text}</p>
                    <span className="text-xs opacity-70 mt-1 block">
                      {msg.type === 'user' ? 'Anda' : 'Customer Service'}
                    </span>
                  </div>
                </div>
              ))}
              
              {/* Interim transcript display */}
              {interimTranscript && (
                <div className="flex justify-end">
                  <div className="max-w-[80%] rounded-2xl px-4 py-3 bg-gradient-to-r from-blue-700 to-blue-600 text-white rounded-br-none opacity-90">
                    <p className="text-sm italic leading-relaxed">{interimTranscript}</p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center">
                        <div className="flex space-x-1">
                          <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                          <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse delay-75"></div>
                          <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse delay-150"></div>
                        </div>
                        <span className="text-xs ml-2 text-blue-100">Mendengarkan...</span>
                      </div>
                      <span className="text-xs text-blue-100">
                        {formatTime()}
                      </span>
                    </div>
                  </div>
                </div>
              )}
              
              {isProcessing && (
                <div className="flex justify-end">
                  <div className="max-w-[80%] rounded-2xl px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-400 text-white rounded-br-none">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                        <span className="text-sm">Mengirim pesan suara...</span>
                      </div>
                      <span className="text-xs opacity-70">
                        {formatTime()}
                      </span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
            
            {/* Input Area */}
            <div className="flex flex-col gap-3">
              {isListening && (
                <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="animate-pulse rounded-full bg-red-500 h-3 w-3"></div>
                      <span className="text-sm font-semibold text-red-700">Sedang Merekam</span>
                    </div>
                    <span className="text-sm font-mono text-red-600">
                      {formatRecordingTime(recordingTime)}
                    </span>
                  </div>
                  <p className="text-xs text-red-600">
                    Bicara sekarang... Lepas tombol untuk mengirim pesan suara
                  </p>
                </div>
              )}
              
              <div className="flex items-center gap-2">
                <div className="flex-1 relative">
                  <Input
                    placeholder={isListening ? "🎤 Sedang merekam..." : "✏️ Ketik pesan..."}
                    value={message}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    className={`pr-20 transition-all ${
                      isListening 
                        ? 'border-red-300 ring-2 ring-red-100 bg-red-50' 
                        : 'border-zinc-300'
                    }`}
                    disabled={isListening || isProcessing}
                    aria-label="Pesan untuk customer service"
                  />
                  
                  {(message || interimTranscript) && !isListening && !isProcessing && (
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={clearVoiceInput}
                      className="absolute right-10 top-1/2 transform -translate-y-1/2 h-6 w-6"
                      title="Hapus pesan"
                    >
                      <Trash2 className="w-3 h-3 text-zinc-400" />
                    </Button>
                  )}
                </div>
                
                <Button
                  size="icon"
                  onClick={toggleListening}
                  variant={isListening ? "destructive" : "default"}
                  className={`transition-all relative ${
                    isListening 
                      ? "animate-pulse shadow-lg bg-gradient-to-r from-red-600 to-red-500" 
                      : "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600"
                  }`}
                  title={isListening ? "Lepas untuk kirim pesan suara" : "Tekan untuk merekam suara"}
                  aria-label={isListening ? "Lepas untuk kirim pesan suara" : "Tekan untuk merekam suara"}
                  aria-pressed={isListening}
                  disabled={isProcessing}
                >
                  {isListening ? (
                    <>
                      <MicOff className="w-4 h-4" />
                      {recordingTime > 0 && (
                        <span className="absolute -top-1 -right-1 bg-white text-red-600 text-[8px] rounded-full w-4 h-4 flex items-center justify-center">
                          {recordingTime}
                        </span>
                      )}
                    </>
                  ) : (
                    <Mic className="w-4 h-4" />
                  )}
                </Button>
                
                <Button 
                  size="icon" 
                  onClick={handleSendMessage}
                  disabled={(!message.trim() && !interimTranscript.trim()) || isListening || isProcessing}
                  className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white shadow-md"
                  aria-label="Kirim pesan"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              
              {/* Status Indicators */}
              {isListening && (
                <div className="flex items-center justify-center">
                  <Badge variant="outline" className="animate-pulse border-red-300 bg-red-50">
                    <Mic className="w-3 h-3 mr-1.5 animate-bounce" />
                    <span className="text-xs text-red-600 font-medium">
                      Bicara sekarang... Lepas tombol untuk kirim
                    </span>
                  </Badge>
                </div>
              )}
              
              {/* Browser Compatibility Warning */}
              {!speechSupported && (
                <div 
                  className="text-xs text-amber-700 bg-amber-50 p-3 rounded-lg border border-amber-200"
                  role="alert"
                >
                  <div className="flex items-start gap-2">
                    <span className="text-base">⚠️</span>
                    <div>
                      <p className="font-medium mb-1">Fitur voice note tidak didukung</p>
                      <p className="opacity-80">
                        Browser Anda tidak mendukung pengenalan suara. Coba gunakan Chrome, Edge, 
                        atau Safari versi terbaru untuk pengalaman terbaik.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Instructions */}
              <div className="text-xs text-zinc-500 text-center px-2">
                <div className="flex flex-col gap-1">
                  <span className="inline-flex items-center gap-1">
                    <kbd className="px-2 py-1 bg-zinc-100 rounded text-xs border">Enter</kbd>
                    <span>untuk mengirim teks</span>
                  </span>
                  <span className="text-xs text-blue-600 font-medium">
                    • Tekan & tahan tombol mikrofon untuk merekam, lepas untuk langsung kirim •
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Button
          size="lg"
          className="rounded-full w-16 h-16 shadow-2xl relative bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 transition-all transform hover:scale-105 group"
          onClick={() => setIsOpen(true)}
          aria-label="Buka chat customer service"
        >
          <MessageCircle className="w-7 h-7" />
          {speechSupported && (
            <>
              <div className="absolute -top-1 -right-1">
                <div className="bg-white rounded-full p-1 shadow-lg">
                  <Mic className="w-3 h-3 text-blue-500" />
                </div>
              </div>
              <div className="absolute -bottom-2 inset-x-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-xs bg-black text-white px-2 py-1 rounded whitespace-nowrap">
                  Voice Note
                </span>
              </div>
            </>
          )}
          {/* Notification badge */}
          {messages.filter(msg => msg.type === 'user').length > 0 && (
            <div className="absolute -top-1 -left-1">
              <div className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-bounce">
                {messages.filter(msg => msg.type === 'user').length}
              </div>
            </div>
          )}
        </Button>
      )}
    </div>
  );
};

export default ChatCs;