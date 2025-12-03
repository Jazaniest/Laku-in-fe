// types/voice.ts

// ==========================================
// Web Speech API Types
// ==========================================

export interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

export interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

export interface SpeechRecognitionResult {
  length: number;
  isFinal: boolean;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

export interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

export interface SpeechRecognitionErrorEvent extends Event {
  error: 
    | 'no-speech'
    | 'aborted'
    | 'audio-capture'
    | 'network'
    | 'not-allowed'
    | 'service-not-allowed'
    | 'bad-grammar'
    | 'language-not-supported';
  message?: string;
}

export interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  
  start(): void;
  stop(): void;
  abort(): void;
  
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
}

export interface SpeechRecognitionConstructor {
  new (): SpeechRecognition;
}

// ==========================================
// Window Interface Extension
// ==========================================

declare global {
  interface Window {
    SpeechRecognition: SpeechRecognitionConstructor;
    webkitSpeechRecognition: SpeechRecognitionConstructor;
  }
}

// ==========================================
// Application Types
// ==========================================

export interface VoiceMessage {
  text: string;
  timestamp: string;
  userId?: string;
  conversationId?: string;
}

export interface VoiceMessageResponse {
  success: boolean;
  message: string;
  data?: {
    id?: string;
    text?: string;
    processedAt?: string;
    [key: string]: unknown;
  };
}

export interface VoiceError {
  type: 'recognition' | 'network' | 'permission' | 'unknown';
  message: string;
  originalError?: Error;
}
