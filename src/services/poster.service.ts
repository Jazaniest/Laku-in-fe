import type {
  GeneratedPoster,
  PosterEditData,
  AIGenerationResult,
  PosterHistory,
  PosterValidation,
  PosterStyle
} from '@/types/poster.types';

class PosterService {
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Simulate AI poster generation
  private async simulateAIGeneration(_file: File, style?: string, template?: string): Promise<AIGenerationResult> {
    // Simulate processing time
    await this.delay(3000);

    // Simulate random scenarios
    const scenarios = ['success', 'partial', 'failed'];
    const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];

    if (scenario === 'failed') {
      return {
        success: false,
        confidence: 0,
        errorMessage: 'Gagal menghasilkan poster. Silakan coba dengan gambar yang lebih jelas.',
        processingTime: 3000
      };
    }

    // Generate dummy edited data
    const editedData: PosterEditData = {
      title: 'Produk Spesial',
      description: 'Kualitas terbaik dengan harga terjangkau',
      price: 49900,
      discount: 20,
      callToAction: 'Pesan Sekarang',
      backgroundColor: '#FFFFFF',
      textColor: '#000000',
      accentColor: '#FF6B6B',
      style: style || 'modern',
      template: template || 'product'
    };

    return {
      success: true,
      confidence: scenario === 'success' ? 95 : 75,
      generatedImageUrl: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600'%3E%3Crect fill='%23FFFFFF' width='800' height='600'/%3E%3Ctext x='400' y='300' font-size='48' text-anchor='middle' fill='%23000000'%3EPoster Generated%3C/text%3E%3C/svg%3E`,
      editedData,
      rawMetadata: {
        generatedAt: new Date().toISOString(),
        model: 'ai-poster-v1',
        processingRegion: 'us-east-1'
      },
      processingTime: 3000
    };
  }

  // Upload and generate poster
  async uploadAndGeneratePoster(file: File, style?: string, template?: string): Promise<GeneratedPoster> {
    await this.delay(500);

    // Validate file
    const validation = this.validateFile(file);
    if (!validation.isValid) {
      throw new Error(validation.errors[0]);
    }

    // Create upload record
    const upload: GeneratedPoster = {
      id: `PG-${Date.now()}`,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      originalImageUrl: URL.createObjectURL(file),
      generatedImageUrl: '',
      uploadedAt: new Date(),
      status: 'processing',
      style,
      template
    };

    // Simulate AI generation
    const aiResult = await this.simulateAIGeneration(file, style, template);

    if (!aiResult.success) {
      return {
        ...upload,
        status: 'failed',
        errorMessage: aiResult.errorMessage,
        confidence: 0
      };
    }

    return {
      ...upload,
      status: 'completed',
      generatedImageUrl: aiResult.generatedImageUrl || '',
      editedData: aiResult.editedData,
      confidence: aiResult.confidence
    };
  }

  // Validate file
  private validateFile(file: File): PosterValidation {
    const errors: string[] = [];
    const warnings: string[] = [];
    const suggestions: string[] = [];

    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      errors.push('Format file tidak didukung. Gunakan JPG, PNG, atau WebP.');
    }

    // Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      errors.push('Ukuran file terlalu besar. Maksimal 10MB.');
    }

    // Warnings
    if (file.size < 100 * 1024) {
      warnings.push('Ukuran file kecil. Pastikan gambar cukup jelas.');
    }

    // Suggestions
    suggestions.push('Pastikan gambar produk terlihat jelas dan menarik');
    suggestions.push('Hindari bayangan dan latar belakang yang berantakan');
    suggestions.push('Gunakan pencahayaan yang baik untuk hasil optimal');

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      suggestions
    };
  }

  // Validate edited data
  validateEditedData(data: PosterEditData): PosterValidation {
    const errors: string[] = [];
    const warnings: string[] = [];
    const suggestions: string[] = [];

    // Check if title exists
    if (!data.title || data.title.trim().length === 0) {
      errors.push('Judul poster tidak boleh kosong');
    }

    // Check title length
    if (data.title && data.title.length > 100) {
      warnings.push('Judul terlalu panjang, pertimbangkan untuk mempersingkat');
    }

    // Check price
    if (data.price && data.price < 0) {
      errors.push('Harga tidak boleh negatif');
    }

    // Check discount
    if (data.discount && (data.discount < 0 || data.discount > 100)) {
      errors.push('Diskon harus antara 0-100%');
    }

    // Suggestions
    if (!data.callToAction) {
      suggestions.push('Tambahkan call-to-action untuk meningkatkan konversi');
    }

    if (!data.description) {
      suggestions.push('Tambahkan deskripsi produk untuk informasi lebih lengkap');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      suggestions
    };
  }

  // Confirm and save poster
  async confirmAndSavePoster(
    posterId: string,
    editedData: PosterEditData,
    adjustments?: Partial<PosterEditData>
  ): Promise<{ success: boolean; downloadUrl: string }> {
    await this.delay(800);

    // Merge adjustments if any
    const finalData = adjustments ? { ...editedData, ...adjustments } : editedData;

    // Validate final data
    const validation = this.validateEditedData(finalData);
    if (!validation.isValid) {
      throw new Error(validation.errors.join(', '));
    }

    // Simulate saving poster
    const downloadUrl = `poster_${posterId}_${Date.now()}.png`;
    console.log('Saving poster:', {
      posterId,
      downloadUrl,
      data: finalData
    });

    return {
      success: true,
      downloadUrl
    };
  }

  // Get poster history
  async getPosterHistory(): Promise<PosterHistory[]> {
    await this.delay(600);

    // Generate dummy history
    const history: PosterHistory[] = [];
    for (let i = 0; i < 8; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);

      history.push({
        id: `PH-${i}`,
        poster: {
          id: `PG-${i}`,
          fileName: `poster_${i}.jpg`,
          fileSize: 350000 + Math.random() * 600000,
          fileType: 'image/jpeg',
          originalImageUrl: '',
          generatedImageUrl: '',
          uploadedAt: date,
          status: 'completed',
          confidence: 85 + Math.random() * 15,
          style: ['modern', 'vintage', 'minimalist'][Math.floor(Math.random() * 3)],
          template: ['product', 'food', 'promotion'][Math.floor(Math.random() * 3)]
        },
        createdAt: date,
        downloaded: Math.random() > 0.4
      });
    }

    return history;
  }

  // Get poster detail
  async getPosterDetail(posterId: string): Promise<GeneratedPoster | null> {
    await this.delay(300);

    const history = await this.getPosterHistory();
    const found = history.find(h => h.poster.id === posterId);
    return found ? found.poster : null;
  }

  // Delete poster
  async deletePoster(posterId: string): Promise<boolean> {
    await this.delay(400);
    console.log('Deleting poster:', posterId);
    return true;
  }

  // Retry failed generation
  async retryGeneration(posterId: string): Promise<GeneratedPoster> {
    await this.delay(500);
    console.log('Retrying generation:', posterId);

    // Simulate retry with better result
    const poster = await this.getPosterDetail(posterId);
    if (!poster) {
      throw new Error('Poster not found');
    }

    return {
      ...poster,
      status: 'completed',
      errorMessage: undefined,
      confidence: 92
    };
  }

  // Get available styles
  async getAvailableStyles(): Promise<PosterStyle[]> {
    await this.delay(300);

    return [
      {
        id: 'modern',
        name: 'Modern',
        description: 'Desain kontemporer dengan warna cerah'
      },
      {
        id: 'vintage',
        name: 'Vintage',
        description: 'Gaya klasik dengan sentuhan retro'
      },
      {
        id: 'minimalist',
        name: 'Minimalist',
        description: 'Desain sederhana dan elegan'
      },
      {
        id: 'bold',
        name: 'Bold',
        description: 'Warna berani dan typography kuat'
      },
      {
        id: 'elegant',
        name: 'Elegant',
        description: 'Desain mewah dan sophisticated'
      }
    ];
  }

  // Get generation statistics
  async getGenerationStatistics(): Promise<{
    totalGenerated: number;
    successfulGenerated: number;
    failedGenerated: number;
    averageConfidence: number;
    totalDownloads: number;
  }> {
    await this.delay(400);

    return {
      totalGenerated: 234,
      successfulGenerated: 218,
      failedGenerated: 16,
      averageConfidence: 89.3,
      totalDownloads: 156
    };
  }

  // Download poster
  async downloadPoster(posterId: string): Promise<string> {
    await this.delay(800);
    console.log('Downloading poster:', posterId);
    return `poster_${posterId}_${Date.now()}.png`;
  }
}

export const posterService = new PosterService();
