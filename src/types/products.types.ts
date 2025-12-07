export interface Product {
  id: number;
  name: string;
  stock: number;
  price: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProductRequest {
  name: string;
  stock: number;
  price: number;
}

export interface UpdateProductRequest {
  name?: string;
  stock?: number;
  price?: number;
}

export interface ProductUploadResponse {
  success: boolean;
  message: string;
  processedItems: number;
}

export interface StockUploadData {
  updated: number;
  added: number;
  skipped: number;
  fileName: string;
  summary: string;
  processedItems: Array<{
    name: string;
    oldStock?: number;
    newStock: number;
    action: 'updated' | 'added';
  }>;
}