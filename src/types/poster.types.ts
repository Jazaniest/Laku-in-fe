export interface PosterStyle {
  id: string;
  name: string;
  description: string;
  thumbnail?: string;
}

export interface PosterTemplate {
  id: string;
  name: string;
  category: 'food' | 'product' | 'promotion' | 'social-media';
  aspectRatio: '1:1' | '16:9' | '9:16' | '4:3';
  description?: string;
}

export interface GeneratedPoster {
  id: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  originalImageUrl: string;
  generatedImageUrl: string;
  uploadedAt: Date;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  style?: string;
  template?: string;
  editedData?: PosterEditData;
  errorMessage?: string | null;
  confidence?: number; // 0-100
}

export interface GeneratedPosterSuccess extends GeneratedPoster {
  status: 'completed';
  generatedImageUrl: string;
  confidence: number;
}

export interface GeneratedPosterFailed extends GeneratedPoster {
  status: 'failed';
  errorMessage: string;
  confidence: 0;
}

export interface GeneratedPosterProcessing extends GeneratedPoster {
  status: 'processing' | 'pending';
}

export interface PosterEditData {
  title?: string;
  description?: string;
  price?: number;
  discount?: number;
  callToAction?: string;
  backgroundColor?: string;
  textColor?: string;
  accentColor?: string;
  style?: string;
  template?: string;
}

export interface PosterHistory {
  id: string;
  poster: GeneratedPoster;
  createdAt: Date;
  downloaded: boolean;
}

export interface AIGenerationResult {
  success: boolean;
  confidence: number;
  generatedImageUrl?: string;
  editedData?: PosterEditData;
  rawMetadata?: Record<string, unknown>;
  errorMessage?: string;
  processingTime: number;
}

export interface PosterValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  suggestions: string[];
}
