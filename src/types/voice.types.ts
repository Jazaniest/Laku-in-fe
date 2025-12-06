// types/voice.types.ts

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
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

// ==========================================
// Available Routes Configuration
// ==========================================

export const AVAILABLE_ROUTES = {
  public: ['/', '/auth'] as const,
  protected: [
    '/dashboard',
    '/dashboard/financial-report',
    '/dashboard/business-analytics',
    '/dashboard/receipt-upload',
    '/dashboard/poster-generator',
  ] as const,
} as const;

export type PublicRoute = (typeof AVAILABLE_ROUTES.public)[number];
export type ProtectedRoute = (typeof AVAILABLE_ROUTES.protected)[number];
export type AvailableRoute = PublicRoute | ProtectedRoute;

// ==========================================
// Navigation Types
// ==========================================

export interface NavigationParams {
  [key: string]: string | number | boolean | undefined;
}

export interface NavigationResponse {
  path: AvailableRoute;
  params?: NavigationParams;
  timestamp: number;
}

export interface TextResponse {
  message: string;
  timestamp: number;
}

export type BackendResponseData = TextResponse | NavigationResponse;

export interface BackendResponse {
  type: 'text' | 'navigation';
  data: BackendResponseData;
}

// ==========================================
// Route Validation Types
// ==========================================

export interface RouteValidationResult {
  isValid: boolean;
  isProtected: boolean;
  message?: string;
}

// ==========================================
// Voice Message Types
// ==========================================

export type VoiceMessageStatus = 'recording' | 'sending' | 'sent' | 'error';

export interface VoiceMessage {
  id: string;
  audio: Blob;
  duration: number;
  timestamp: number;
  format: string;
  status: VoiceMessageStatus;
}

export type VoiceResponseType = 'ai' | 'user';

export interface VoiceResponse {
  id: string;
  message: string;
  timestamp: number;
  type: VoiceResponseType;
}

export interface VoiceChatState {
  isRecording: boolean;
  audioChunks: BlobPart[];
  mediaRecorder: MediaRecorder | null;
  stream: MediaStream | null;
  recordingDuration: number;
  messages: VoiceResponse[];
  error: string | null;
}

// ==========================================
// Error Types
// ==========================================
export enum VoiceServiceError {
  MICROPHONE_DENIED = 'MICROPHONE_DENIED',
  NO_SPEECH_DETECTED = 'NO_SPEECH_DETECTED',
  API_ERROR = 'API_ERROR',
  INVALID_ROUTE = 'INVALID_ROUTE',
  ROUTE_PROTECTED = 'ROUTE_PROTECTED',
  ROUTE_NOT_FOUND = 'ROUTE_NOT_FOUND',
  NETWORK_ERROR = 'NETWORK_ERROR',
  INVALID_RESPONSE = 'INVALID_RESPONSE',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

export interface VoiceError {
  code: VoiceServiceError;
  message: string;
  originalError?: Error;
}

// ==========================================
// Type Guards
// ==========================================

export function isTextResponse(data: BackendResponseData): data is TextResponse {
  return (data as TextResponse).message !== undefined && (data as NavigationResponse).path === undefined;
}

export function isNavigationResponse(data: BackendResponseData): data is NavigationResponse {
  return (data as NavigationResponse).path !== undefined;
}

export function isAvailableRoute(path: string): path is AvailableRoute {
  const allRoutes = [...AVAILABLE_ROUTES.public, ...AVAILABLE_ROUTES.protected];
  return allRoutes.includes(path as AvailableRoute);
}