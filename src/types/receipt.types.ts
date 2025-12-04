export interface ReceiptItem {
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  category?: string;
}

export interface ExtractedReceiptData {
  merchantName?: string;
  merchantAddress?: string;
  date: Date;
  time?: string;
  items: ReceiptItem[];
  subtotal: number;
  tax?: number;
  discount?: number;
  total: number;
  paymentMethod?: string;
  receiptNumber?: string;
}

export interface ReceiptUpload {
  id: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  imageUrl: string;
  uploadedAt: Date;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  extractedData?: ExtractedReceiptData;
  transactionId?: string;
  errorMessage?: string | null;
  confidence?: number; // 0-100
}

export interface ReceiptUploadSuccess extends ReceiptUpload {
  status: 'completed';
  extractedData: ExtractedReceiptData;
  confidence: number;
}

export interface ReceiptUploadFailed extends ReceiptUpload {
  status: 'failed';
  errorMessage: string;
  confidence: 0;
}

export interface ReceiptUploadProcessing extends ReceiptUpload {
  status: 'processing' | 'pending';
}

export interface ReceiptHistory {
  id: string;
  receipt: ReceiptUpload;
  createdAt: Date;
  addedToFinancial: boolean;
}

export interface OCRAnalysisResult {
  success: boolean;
  confidence: number;
  extractedData?: ExtractedReceiptData;
  rawText?: string;
  errorMessage?: string;
  processingTime: number;
}

export interface ReceiptValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  suggestions: string[];
}