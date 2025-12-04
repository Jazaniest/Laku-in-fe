import type {
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

class AnalyticsService {
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Generate metrics data
  private generateMetrics(): AnalyticsMetric[] {
    return [
      {
        id: 'M1',
        title: 'Revenue Growth',
        value: '24.5%',
        change: 12.3,
        changeType: 'increase',
        insight: 'Pertumbuhan revenue meningkat signifikan dibanding bulan lalu',
        recommendation: 'Pertahankan strategi marketing yang sedang berjalan'
      },
      {
        id: 'M2',
        title: 'Customer Acquisition Cost',
        value: 'Rp 125K',
        change: -8.5,
        changeType: 'decrease',
        insight: 'Biaya akuisisi customer menurun, efisiensi marketing membaik',
        recommendation: 'Alokasikan budget lebih ke channel yang efektif'
      },
      {
        id: 'M3',
        title: 'Customer Lifetime Value',
        value: 'Rp 2.8M',
        change: 15.7,
        changeType: 'increase',
        insight: 'Nilai customer meningkat, indikasi loyalitas yang baik',
        recommendation: 'Tingkatkan program retention untuk memaksimalkan LTV'
      },
      {
        id: 'M4',
        title: 'Average Order Value',
        value: 'Rp 485K',
        change: 6.2,
        changeType: 'increase',
        insight: 'Nilai rata-rata transaksi naik, strategi upselling berhasil',
        recommendation: 'Implementasikan cross-selling untuk meningkatkan AOV'
      }
    ];
  }

  // Generate performance scores
  private generatePerformanceScores(): PerformanceScore[] {
    return [
      {
        category: 'Profitabilitas',
        score: 85,
        previousScore: 78,
        status: 'excellent',
        description: 'Margin profit sangat sehat dan terus meningkat'
      },
      {
        category: 'Efisiensi Operasional',
        score: 72,
        previousScore: 70,
        status: 'good',
        description: 'Operasional berjalan baik dengan sedikit ruang perbaikan'
      },
      {
        category: 'Kepuasan Customer',
        score: 88,
        previousScore: 85,
        status: 'excellent',
        description: 'Customer sangat puas dengan produk dan layanan'
      },
      {
        category: 'Pertumbuhan Pasar',
        score: 65,
        previousScore: 68,
        status: 'average',
        description: 'Pertumbuhan melambat, perlu strategi akuisisi baru'
      },
      {
        category: 'Cashflow Management',
        score: 79,
        previousScore: 75,
        status: 'good',
        description: 'Arus kas terjaga dengan baik'
      }
    ];
  }

  // Generate trend data
  private generateTrends(): TrendData[] {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun'];
    return months.map((month, idx) => ({
      period: month,
      revenue: 15000000 + (idx * 2500000) + Math.random() * 1000000,
      expense: 9000000 + (idx * 1200000) + Math.random() * 500000,
      profit: 6000000 + (idx * 1300000) + Math.random() * 500000,
      growth: 8 + (idx * 2) + Math.random() * 5
    }));
  }

  // Generate customer insights
  private generateCustomerInsights(): CustomerInsight[] {
    return [
      {
        id: 'CI1',
        metric: 'Customer Retention Rate',
        value: '78%',
        insight: 'Tingkat retensi customer berada di atas rata-rata industri (65%)',
        action: 'Fokus pada program loyalty untuk mempertahankan customer existing',
        priority: 'high'
      },
      {
        id: 'CI2',
        metric: 'Churn Rate',
        value: '22%',
        insight: 'Churn rate meningkat 3% dari bulan lalu, perlu perhatian',
        action: 'Identifikasi penyebab churn dan perbaiki customer experience',
        priority: 'high'
      },
      {
        id: 'CI3',
        metric: 'Net Promoter Score',
        value: '67',
        insight: 'NPS sangat baik, customer cenderung merekomendasikan produk',
        action: 'Manfaatkan promoters untuk referral program',
        priority: 'medium'
      },
      {
        id: 'CI4',
        metric: 'Repeat Purchase Rate',
        value: '45%',
        insight: 'Hampir setengah customer melakukan pembelian ulang',
        action: 'Tingkatkan engagement untuk mendorong repeat purchase',
        priority: 'medium'
      }
    ];
  }

  // Generate product performance
  private generateProductPerformance(): ProductPerformance[] {
    return [
      {
        id: 'PP1',
        category: 'Elektronik',
        revenue: 15600000,
        unitsSold: 245,
        growthRate: 18.5,
        margin: 32,
        status: 'trending'
      },
      {
        id: 'PP2',
        category: 'Fashion',
        revenue: 12300000,
        unitsSold: 456,
        growthRate: 12.3,
        margin: 45,
        status: 'stable'
      },
      {
        id: 'PP3',
        category: 'Rumah Tangga',
        revenue: 8900000,
        unitsSold: 189,
        growthRate: -5.2,
        margin: 28,
        status: 'declining'
      },
      {
        id: 'PP4',
        category: 'Olahraga',
        revenue: 6700000,
        unitsSold: 123,
        growthRate: 8.7,
        margin: 38,
        status: 'stable'
      }
    ];
  }

  // Generate AI predictions
  private generatePredictions(): AIPrediction[] {
    return [
      {
        id: 'PR1',
        type: 'revenue',
        prediction: 28500000,
        confidence: 87,
        timeframe: 'Bulan Depan',
        reasoning: 'Berdasarkan trend 6 bulan terakhir dan seasonality, revenue diperkirakan naik 12%'
      },
      {
        id: 'PR2',
        type: 'growth',
        prediction: 15.8,
        confidence: 82,
        timeframe: 'Quarter Berikutnya',
        reasoning: 'Momentum pertumbuhan positif dengan seasonal factor mendukung'
      },
      {
        id: 'PR3',
        type: 'profit',
        prediction: 18200000,
        confidence: 85,
        timeframe: 'Bulan Depan',
        reasoning: 'Efisiensi operasional meningkat, margin diperkirakan tetap stabil'
      }
    ];
  }

  // Generate AI insights
  private generateAIInsights(): AIInsight[] {
    return [
      {
        id: 'AI1',
        title: 'Opportunity: Ekspansi Kategori Elektronik',
        category: 'opportunity',
        severity: 'high',
        description: 'Kategori elektronik menunjukkan pertumbuhan 18.5% dengan margin 32%. Ini adalah kategori paling menguntungkan saat ini.',
        impact: 'Potensi peningkatan revenue 25-30% dalam 3 bulan',
        actionItems: [
          'Tambah variasi produk elektronik yang sedang trending',
          'Alokasikan 30% budget marketing untuk kategori ini',
          'Negosiasi dengan supplier untuk harga lebih baik'
        ],
        generatedAt: new Date()
      },
      {
        id: 'AI2',
        title: 'Risk: Penurunan Performa Kategori Rumah Tangga',
        category: 'risk',
        severity: 'medium',
        description: 'Kategori rumah tangga mengalami penurunan 5.2% dengan trend negatif selama 3 bulan terakhir.',
        impact: 'Potensi kehilangan revenue Rp 2-3 juta per bulan',
        actionItems: [
          'Lakukan analisis kompetitor untuk kategori ini',
          'Review pricing strategy dan product mix',
          'Survey customer untuk memahami kebutuhan yang berubah'
        ],
        generatedAt: new Date()
      },
      {
        id: 'AI3',
        title: 'Recommendation: Optimasi Marketing Spend',
        category: 'recommendation',
        severity: 'medium',
        description: 'CAC menurun 8.5% menunjukkan efisiensi marketing membaik. Saatnya untuk scale up channel yang berperforma baik.',
        impact: 'Potensi ROI meningkat 20-25%',
        actionItems: [
          'Double down pada channel dengan CAC terendah',
          'Test A/B untuk meningkatkan conversion rate',
          'Implementasi retargeting campaign'
        ],
        generatedAt: new Date()
      },
      {
        id: 'AI4',
        title: 'Alert: Churn Rate Meningkat',
        category: 'alert',
        severity: 'high',
        description: 'Churn rate naik 3% menjadi 22%. Jika tidak ditangani, bisa berdampak pada revenue jangka panjang.',
        impact: 'Potensi kehilangan 50+ customer per bulan',
        actionItems: [
          'Segera implementasi win-back campaign',
          'Perbaiki onboarding experience untuk customer baru',
          'Survey churned customers untuk feedback'
        ],
        generatedAt: new Date()
      }
    ];
  }

  // Generate comparison data
  private generateComparisons(): ComparisonData[] {
    return [
      {
        metric: 'Gross Margin',
        currentPeriod: 38.5,
        previousPeriod: 35.2,
        industryAverage: 32.0,
        change: 9.4,
        status: 'outperforming'
      },
      {
        metric: 'Operating Expense Ratio',
        currentPeriod: 42.3,
        previousPeriod: 45.1,
        industryAverage: 40.0,
        change: -6.2,
        status: 'matching'
      },
      {
        metric: 'Customer Acquisition Cost',
        currentPeriod: 125000,
        previousPeriod: 136700,
        industryAverage: 150000,
        change: -8.5,
        status: 'outperforming'
      },
      {
        metric: 'Average Order Value',
        currentPeriod: 485000,
        previousPeriod: 457000,
        industryAverage: 520000,
        change: 6.1,
        status: 'underperforming'
      }
    ];
  }

  // Get business analytics
  async getBusinessAnalytics(filters?: AnalyticsFilters): Promise<BusinessAnalytics> {
    await this.delay(1200);

    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    return {
      period: {
        startDate: thirtyDaysAgo,
        endDate: today,
        label: filters?.period === 'week' ? '7 Hari Terakhir' : 
               filters?.period === 'quarter' ? 'Quarter Ini' :
               filters?.period === 'year' ? 'Tahun Ini' : '30 Hari Terakhir'
      },
      overallScore: 78,
      metrics: this.generateMetrics(),
      performanceScores: this.generatePerformanceScores(),
      trends: this.generateTrends(),
      customerInsights: this.generateCustomerInsights(),
      productPerformance: this.generateProductPerformance(),
      predictions: this.generatePredictions(),
      aiInsights: this.generateAIInsights(),
      comparisons: this.generateComparisons()
    };
  }

  // Request AI analysis for specific question
  async requestAIAnalysis(question: string): Promise<string> {
    await this.delay(1500);
    
    // Simulate AI response based on question
    const responses: Record<string, string> = {
      'revenue': 'Berdasarkan analisis data 6 bulan terakhir, revenue Anda menunjukkan trend pertumbuhan yang konsisten sebesar 12-15% per bulan. Faktor utama adalah peningkatan customer retention dan average order value. Saya merekomendasikan untuk fokus pada kategori elektronik yang memiliki growth rate tertinggi.',
      'customer': 'Customer base Anda menunjukkan kesehatan yang baik dengan retention rate 78%. Namun, churn rate yang meningkat perlu perhatian. Saya sarankan untuk segera implementasi program loyalty dan win-back campaign untuk mengurangi churn.',
      'profit': 'Profitabilitas bisnis Anda sangat baik dengan margin 38.5%, di atas rata-rata industri. Efisiensi operasional terus meningkat. Untuk optimasi lebih lanjut, fokus pada pengurangan operating expense ratio yang masih 2% di atas target.',
      'growth': 'Potensi pertumbuhan bisnis Anda sangat menjanjikan. Dengan momentum saat ini dan seasonality mendukung, saya prediksi pertumbuhan 15-20% dalam 3 bulan ke depan. Kunci sukses: ekspansi kategori elektronik dan optimasi marketing spend.'
    };

    // Simple keyword matching
    for (const [key, response] of Object.entries(responses)) {
      if (question.toLowerCase().includes(key)) {
        return response;
      }
    }

    return 'Berdasarkan data yang tersedia, bisnis Anda menunjukkan performa yang positif secara keseluruhan. Overall score 78/100 menunjukkan kesehatan bisnis yang baik. Area yang perlu perhatian adalah churn rate dan kategori produk yang declining. Silakan ajukan pertanyaan spesifik untuk analisis lebih mendalam.';
  }

  // Export analytics report
  async exportAnalyticsReport(format: 'pdf' | 'excel'): Promise<string> {
    await this.delay(1000);
    console.log(`Exporting analytics report as ${format}`);
    return `analytics_report_${Date.now()}.${format === 'pdf' ? 'pdf' : 'xlsx'}`;
  }
}

export const analyticsService = new AnalyticsService();