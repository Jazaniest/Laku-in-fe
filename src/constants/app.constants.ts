// Centralized constants for voice commands
export enum VoiceCommands {
  NAVIGATE_DASHBOARD = 'navigate_dashboard',
  NAVIGATE_FINANCIAL = 'navigate_financial',
  NAVIGATE_ANALYTICS = 'navigate_analytics',
  NAVIGATE_RECEIPT = 'navigate_receipt',
  NAVIGATE_POSTER = 'navigate_poster',
  NAVIGATE_WHATSAPP = 'navigate_whatsapp',
  SEARCH_PRODUCT = 'search_product',
  SEARCH_TRANSACTION = 'search_transaction',
  ADD_TO_CART = 'add_to_cart',
  VIEW_ORDERS = 'view_orders',
  VIEW_PROFILE = 'view_profile',
  HELP = 'help',
  UNKNOWN = 'unknown'
}

export const AVAILABLE_VOICE_ROUTES = {
  '/dashboard': VoiceCommands.NAVIGATE_DASHBOARD,
  '/financial-report': VoiceCommands.NAVIGATE_FINANCIAL,
  '/business-analytics': VoiceCommands.NAVIGATE_ANALYTICS,
  '/receipt-upload': VoiceCommands.NAVIGATE_RECEIPT,
  '/poster-generator': VoiceCommands.NAVIGATE_POSTER,
  '/whatsapp': VoiceCommands.NAVIGATE_WHATSAPP
} as const;

export type VoiceRoute = keyof typeof AVAILABLE_VOICE_ROUTES;

// Speech recognition constants
export const SPEECH_RECOGNITION_CONFIG = {
  continuous: true,
  interimResults: true,
  lang: 'id-ID',
  timeout: 10000, // 10 seconds
  maxAlternatives: 1
} as const;

export const VOICE_PROCESSING_CONFIG = {
  debounceDelay: 300, // ms
  maxRetryAttempts: 3,
  retryDelay: 1000, // ms
  confidenceThreshold: 0.6
} as const;

// Error messages in consistent language (Bahasa Indonesia)
export const VOICE_ERROR_MESSAGES = {
  RECOGNITION_NOT_SUPPORTED: 'Fitur pengenalan suara tidak didukung di browser ini',
  MICROPHONE_PERMISSION_DENIED: 'Izin mikrofon ditolak. Silakan aktifkan di pengaturan browser.',
  NETWORK_ERROR: 'Terjadi kesalahan jaringan. Silakan coba lagi.',
  COMMAND_NOT_RECOGNIZED: 'Maaf, perintah tidak dikenali. Silakan coba lagi.',
  PROCESSING_ERROR: 'Terjadi kesalahan saat memproses perintah suara',
  TIMEOUT_ERROR: 'Waktu pengenalan suara habis. Silakan coba lagi.'
} as const;

// Auth constants
export const AUTH_CONSTANTS = {
  TOKEN_KEY: 'auth_token',
  REFRESH_TOKEN_KEY: 'refresh_token',
  TOKEN_EXPIRY_KEY: 'token_expiry',
  TOKEN_REFRESH_THRESHOLD: 300, // 5 minutes before expiry
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION: 900000, // 15 minutes in milliseconds
  PASSWORD_MIN_LENGTH: 6,
  PASSWORD_MAX_LENGTH: 50
} as const;