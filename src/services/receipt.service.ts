import type {
  ReceiptUpload,
  ExtractedReceiptData,
  OCRAnalysisResult,
  ReceiptHistory,
  ReceiptValidation,
  ReceiptItem
} from '@/types/receipt.types';

class ReceiptService {
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  //eslint-disable-next-line
  private async simulateOCRAnalysis(_file: File): Promise<OCRAnalysisResult> {
    // Simulate processing time
    await this.delay(2000);

    // Simulate random scenarios
    const scenarios = ['success', 'partial', 'failed'];
    const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];

    if (scenario === 'failed') {
      return {
        success: false,
        confidence: 0,
        errorMessage: 'Gambar tidak jelas atau tidak terbaca. Silakan upload ulang dengan pencahayaan yang lebih baik.',
        processingTime: 2000
      };
    }

    // Generate dummy extracted data
    const items: ReceiptItem[] = [
      {
        name: 'Mie Instan',
        quantity: 5,
        unitPrice: 3500,
        totalPrice: 17500,
        category: 'Makanan'
      },
      {
        name: 'Kopi Sachet',
        quantity: 10,
        unitPrice: 2000,
        totalPrice: 20000,
        category: 'Minuman'
      },
      {
        name: 'Sabun Mandi',
        quantity: 2,
        unitPrice: 8500,
        totalPrice: 17000,
        category: 'Perlengkapan'
      },
      {
        name: 'Shampo',
        quantity: 1,
        unitPrice: 15000,
        totalPrice: 15000,
        category: 'Perlengkapan'
      }
    ];

    const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + tax;

    const extractedData: ExtractedReceiptData = {
      merchantName: 'Toko Sumber Rejeki',
      merchantAddress: 'Jl. Raya No. 123, Jakarta',
      date: new Date(),
      time: '14:35:22',
      items,
      subtotal,
      tax,
      discount: 0,
      total,
      paymentMethod: 'cash',
      receiptNumber: `RCP${Date.now()}`
    };

    return {
      success: true,
      confidence: scenario === 'success' ? 95 : 75,
      extractedData,
      rawText: 'Simulated OCR raw text...',
      processingTime: 2000
    };
  }

  // Upload and analyze receipt
  async uploadReceipt(file: File): Promise<ReceiptUpload> {
    await this.delay(500);

    // Validate file
    const validation = this.validateFile(file);
    if (!validation.isValid) {
      throw new Error(validation.errors[0]);
    }

    // Create upload record
    const upload: ReceiptUpload = {
      id: `RU-${Date.now()}`,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      imageUrl: URL.createObjectURL(file),
      uploadedAt: new Date(),
      status: 'processing'
    };

    // Simulate OCR analysis
    const ocrResult = await this.simulateOCRAnalysis(file);

    if (!ocrResult.success) {
      return {
        ...upload,
        status: 'failed',
        errorMessage: ocrResult.errorMessage,
        confidence: 0
      };
    }

    return {
      ...upload,
      status: 'completed',
      extractedData: ocrResult.extractedData,
      confidence: ocrResult.confidence
    };
  }

  // Validate file
  private validateFile(file: File): ReceiptValidation {
    const errors: string[] = [];
    const warnings: string[] = [];
    const suggestions: string[] = [];

    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      errors.push('Format file tidak didukung. Gunakan JPG, PNG, atau WebP.');
    }

    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      errors.push('Ukuran file terlalu besar. Maksimal 5MB.');
    }

    // Warnings
    if (file.size < 100 * 1024) {
      warnings.push('Ukuran file kecil. Pastikan gambar cukup jelas.');
    }

    // Suggestions
    suggestions.push('Pastikan pencahayaan cukup dan teks terbaca dengan jelas');
    suggestions.push('Hindari bayangan dan pantulan cahaya');
    suggestions.push('Posisikan nota dalam frame dengan baik');

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      suggestions
    };
  }

  // Validate extracted data
  validateExtractedData(data: ExtractedReceiptData): ReceiptValidation {
    const errors: string[] = [];
    const warnings: string[] = [];
    const suggestions: string[] = [];

    // Check if items exist
    if (!data.items || data.items.length === 0) {
      errors.push('Tidak ada item yang terdeteksi');
    }

    // Check if total makes sense
    const calculatedTotal = data.items.reduce((sum, item) => sum + item.totalPrice, 0);
    if (Math.abs(calculatedTotal - data.subtotal) > 100) {
      warnings.push('Total item tidak sesuai dengan subtotal');
    }

    // Check if date is valid
    if (!data.date || data.date > new Date()) {
      errors.push('Tanggal tidak valid');
    }

    // Suggestions
    if (!data.merchantName) {
      suggestions.push('Nama toko tidak terdeteksi, silakan input manual');
    }

    if (!data.paymentMethod) {
      suggestions.push('Metode pembayaran tidak terdeteksi, silakan pilih manual');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      suggestions
    };
  }

  // Confirm and add to financial records
  async confirmAndAddToFinancial(
    receiptId: string,
    extractedData: ExtractedReceiptData,
    adjustments?: Partial<ExtractedReceiptData>
  ): Promise<{ success: boolean; transactionId: string }> {
    await this.delay(800);

    // Merge adjustments if any
    const finalData = adjustments ? { ...extractedData, ...adjustments } : extractedData;

    // Validate final data
    const validation = this.validateExtractedData(finalData);
    if (!validation.isValid) {
      throw new Error(validation.errors.join(', '));
    }

    // Simulate adding to financial records
    const transactionId = `TRX-${Date.now()}`;
    console.log('Adding to financial records:', {
      receiptId,
      transactionId,
      data: finalData
    });

    return {
      success: true,
      transactionId
    };
  }

  // Get receipt history
  async getReceiptHistory(): Promise<ReceiptHistory[]> {
    await this.delay(600);

    // Generate dummy history
    const history: ReceiptHistory[] = [];
    for (let i = 0; i < 10; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);

      history.push({
        id: `RH-${i}`,
        receipt: {
          id: `RU-${i}`,
          fileName: `receipt_${i}.jpg`,
          fileSize: 250000 + Math.random() * 500000,
          fileType: 'image/jpeg',
          imageUrl: '',
          uploadedAt: date,
          status: 'completed',
          confidence: 80 + Math.random() * 20,
          transactionId: `TRX-${1000 + i}`
        },
        createdAt: date,
        addedToFinancial: Math.random() > 0.3
      });
    }

    return history;
  }

  // Get receipt detail
  async getReceiptDetail(receiptId: string): Promise<ReceiptUpload | null> {
    await this.delay(300);

    const history = await this.getReceiptHistory();
    const found = history.find(h => h.receipt.id === receiptId);
    return found ? found.receipt : null;
  }

  // Delete receipt
  async deleteReceipt(receiptId: string): Promise<boolean> {
    await this.delay(400);
    console.log('Deleting receipt:', receiptId);
    return true;
  }

  // Retry failed upload
  async retryUpload(receiptId: string): Promise<ReceiptUpload> {
    await this.delay(500);
    console.log('Retrying upload:', receiptId);

    // Simulate retry with better result
    const receipt = await this.getReceiptDetail(receiptId);
    if (!receipt) {
      throw new Error('Receipt not found');
    }

    return {
      ...receipt,
      status: 'completed',
      errorMessage: undefined,
      confidence: 90
    };
  }

  // Get upload statistics
  async getUploadStatistics(): Promise<{
    totalUploads: number;
    successfulUploads: number;
    failedUploads: number;
    averageConfidence: number;
    totalAmount: number;
  }> {
    await this.delay(400);

    return {
      totalUploads: 156,
      successfulUploads: 142,
      failedUploads: 14,
      averageConfidence: 87.5,
      totalAmount: 45600000
    };
  }

  // Export receipts
  async exportReceipts(
    format: 'pdf' | 'excel',
    dateRange?: { start: Date; end: Date }
  ): Promise<string> {
    await this.delay(1000);
    console.log(`Exporting receipts as ${format}`, dateRange);
    return `receipts_export_${Date.now()}.${format === 'pdf' ? 'pdf' : 'xlsx'}`;
  }
}

export const receiptService = new ReceiptService();