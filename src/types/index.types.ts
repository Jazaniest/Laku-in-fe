/**
 * Main types export file
 * Menggabungkan semua types yang dibutuhkan
 */

// Re-export auth types
export type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  AuthErrorResponse,
  User
} from '@/types/auth.types';

// Re-export product types
export type {
  Product,
  CreateProductRequest,
  UpdateProductRequest,
  StockUploadData
} from '@/types/products.types';

// Re-export transaction types
export type {
  Transaction,
  CreateTransactionRequest,
  ExtractedTransactionData
} from '@/types/transactions.types';

// Re-export analytics types
export type {
  BusinessAnalytics,
  AnalyticsMetric,
  PerformanceScore,
  TrendData,
  CustomerInsight,
  ProductPerformance,
  AIPrediction,
  AIInsight,
  ComparisonData,
  AnalyticsFilters
} from '@/types/analytics.types';