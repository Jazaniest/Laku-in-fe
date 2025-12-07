export interface Transaction {
  id: string;
  item_name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  sale_date: Date;
  created_at: Date;
  customer: {
    name: string;
    phone: string;
  };
}

export interface CreateTransactionRequest {
  item_name: string;
  quantity: number;
  unit_price: number;
  sale_date: string;
  customer?: {
    name: string;
    phone: string;
  };
}

export interface ExtractedItem {
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  category?: string;
}

export interface ExtractedTransactionData {
  items: ExtractedItem[];
  totalAmount: number;
  date: Date;
  merchant: string;
  paymentMethod: string;
  processingTime: string;
}

export interface TransactionUploadResponse {
  success: boolean;
  extractedData: ExtractedTransactionData;
  message: string;
}