/**
 * Types untuk endpoint-endpoint yang belum memiliki types
 * Sesuai dengan dokumentasi endpoint.md
 */

// Market Price Recommendation Types
export interface MarketPriceRecommendation {
  id: string;
  productName: string;
  suggestedPrice: number;
  marketPrice: number;
  confidence: number;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateMarketPriceRecommendationRequest {
  // Empty DTO as per documentation
}

export interface UpdateMarketPriceRecommendationRequest {
  // Empty DTO as per documentation  
}

// Chat Bot Types
export interface ChatBotMessage {
  message: string;
  timestamp?: string;
}

export interface ChatBotResponse {
  response: string;
  timestamp: string;
  sessionId?: string;
}

export interface ChatBotErrorResponse {
  error: string;
  timestamp: string;
}

// AI Voice Navigation Types
export interface AIVoiceNavigation {
  id: string;
  command: string;
  response: string;
  type: 'text' | 'navigate' | 'error';
  confidence: number;
  createdAt: string;
  processedAt?: string;
}

export interface CreateAIVoiceNavigationRequest {
  // Empty DTO as per documentation
}

export interface UpdateAIVoiceNavigationRequest {
  // Empty DTO as per documentation
}

export interface ProcessTranscriptRequest {
  transcript: string;
}

export interface InitializeVoiceResponse {
  status: string;
  initialized: boolean;
  message: string;
}

export interface VoiceResponseDto {
  type: 'text' | 'navigate' | 'error';
  data: {
    message?: string;
    path?: string;
    category?: string;
    instruction?: string;
    originalCommand?: string;
    error?: string;
  };
}

// Product Media Editor Types
export interface ProductMediaEditorRequest {
  file: File;
}

export interface ProductMediaEditorResponse {
  success: boolean;
  editedImageUrl: string;
  originalImageUrl: string;
  processingTime: number;
  metadata?: {
    width: number;
    height: number;
    format: string;
    size: number;
  };
}

// User Management Types
export interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  role?: string;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  avatar?: string;
  phone?: string;
  address?: string;
}

export interface DeleteUserResponse {
  success: boolean;
  message: string;
  deletedUserId: string;
}

// Business Analytics Types (additional)
export interface BusinessSummaryRequest {
  phone: string;
  limit?: string;
  days?: string;
}

export interface FinancialSummaryRequest {
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
}

// Authentication Types (additional)
export interface RefreshTokenRequest {
  // From cookies
}

export interface RefreshTokenResponse {
  success: boolean;
  token?: string;
  message?: string;
}

export interface LogoutResponse {
  ok: boolean;
  message: string;
}

// Common Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Error Types
export interface ApiError {
  statusCode: number;
  message: string;
  error?: string;
  timestamp: string;
  path?: string;
}

export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

export interface ValidationErrorResponse extends ApiError {
  errors: ValidationError[];
}