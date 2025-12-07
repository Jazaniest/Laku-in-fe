/**
 * Analytics Service Simulasi - Semua data dummy untuk demo
 */

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
    return new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 700));
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
        revenue: 8920000,
        unitsSold: 156,
        growthRate: 12.3,
        margin: 28,
        status: 'stable'
      },
      {
        id: 'PP3',
        category: 'Makanan',
        revenue: 6720000,
        unitsSold: 324,
        growthRate: 8.7,
        margin: 22,
        status: 'growing'
      },
      {
        id: 'PP4',
        category: 'Perabotan',
        revenue: 4890000,
        unitsSold: 67,
        growthRate: 5.2,
        margin: 35,
        status: 'declining'
      },
      {
        id: 'PP5',
        category: 'Perawatan',
        revenue: 3250000,
        unitsSold: 189,
        growthRate: 15.1,
        margin: 41,
        status: 'trending'
      }
    ];
  }

  // Generate AI predictions
  private generateAIPredictions(): AIPrediction[] {
    return [
      {
        id: 'AI1',
        metric: 'Penjualan Bulan Depan',
        currentValue: 'Rp 285M',
        predictedValue: 'Rp 345M',
        confidence: 82,
        trend: 'upward',
        factors: ['Tren positif 3 bulan terakhir', 'Seasonal uptick expected', 'New product launch'],
        timeframe: '1 month'
      },
      {
        id: 'AI2',
        metric: 'Customer Churn',
        currentValue: '18%',
        predictedValue: '15%',
        confidence: 74,
        trend: 'downward',
        factors: ['Improved customer service programs', 'Better onboarding process'],
        timeframe: '2 weeks'
      }
    ];
  }

  // Generate AI insights
  private generateAIInsights(): AIInsight[] {
    return [
      {
        id: 'I1',
        title: 'Revenue Optimization Opportunity',
        description: 'Analisis menunjukkan potensi peningkatan revenue sebesar 15% dengan strategi pricing yang tepat',
        priority: 'high',
        accuracy: 87,
        sourceMetrics: ['AOV', 'Conversion Rate', 'Customer Segmentation']
      },
      {
        id: 'I2',
        title: 'Inventory Management Alert',
        description: 'Stok beberapa produk trending menipis. Disarankan restock dalam 5 hari ke depan',
        priority: 'medium',
        accuracy: 92,
        sourceMetrics: ['Stock Levels', 'Sales Velocity', 'Seasonal Trends']
      },
      {
        id: 'I3',
        title: 'Customer Retention Strategy',
        description: 'Customer segmen medium-spend perlu perhatian khusus. Program loyalty dapat meningkatkan retention hingga 25%',
        priority: 'high',
        accuracy: 81,
        sourceMetrics: ['CLV', 'NPS', 'Churn Rate']
      }
    ];
  }

  // Get business analytics dashboard
  async getBusinessAnalytics(filters?: AnalyticsFilters): Promise<BusinessAnalytics> {
    // Simulate API delay
    await this.delay(500);

    const metrics = this.generateMetrics();
    const performanceScores = this.generatePerformanceScores();
    const trends = this.generateTrends();
    const customerInsights = this.generateCustomerInsights();
    const productPerformance = this.generateProductPerformance();
    const aiPredictions = this.generateAIPredictions();
    const aiInsights = this.generateAIInsights();

    // Simulate AI filtering based on filters
    let filteredMetrics = metrics;
    if (filters) {
      if (filters.timeRange) {
        filteredMetrics = metrics.filter(m => 
          m.title.toLowerCase().includes(filters.timeRange!) ||
          m.title.toLowerCase() === 'Revenue Growth'.toLowerCase()
        );
      }
      
      if (filters.category) {
        filteredMetrics = metrics.filter(m =>
          m.title.toLowerCase().includes(filters.category!)
        );
      }
    }

    return {
      id: 'BA-' + Date.now(),
      timeframe: filters.timeRange || 'Current Month',
      metrics: filteredMetrics,
      performanceScores: [
        ...performanceScores,
        {
          category: 'Keuangan',
          score: Math.floor(Math.random() *10) + 80,
          previousScore: Math.floor(Math.random() *10) + 78,
          status: 'excellent',
          description: 'Kesehatan keuangan sangat baik dengan profitabilitas tinggi'
        }
      ],
      trends: trends.map(t => ({
        ...t,
        predictions: t.growth > 10 ? 'positive' : t.growth > 0 ? 'neutral' : 'negative'
      })),
      customerInsights: customerInsights.map((insight, idx) => ({
        ...insight,
        impact: 'medium' as 'medium' | 'high' | 'low'
      })),
      productPerformance: productPerformance.map(pp => ({
        ...pp,
        marketShare: Math.floor(Math.random() *15) + 5,
        competitors: [
          { name: 'Competitor A', performance: (pp.revenue * 0.8) },
          { name: 'Competitor B', performance: (pp.revenue * 0.6) }
        ]
      })),
      aiPredictions, 
      aiInsights
    };
  }

  // Get comparative analytics data
  async getComparativeAnalytics(filters?: AnalyticsFilters): Promise<ComparisonData> {
    await this.delay(600);
    
    const trends = this.generateTrends();
    const performanceScores = this.generatePerformanceScores();
    
    return {
      id: 'COMP-' + Date.now(),
      title: 'Komparasi Performa',
      description: 'Perbandingan performa dengan kompetitor dan industri',
      yourData: {
        revenue: 45000000,
        growth: 15.2,
        customers: 1200
      },
      competitorData: {
        revenue: 38000000,
        growth: 8.7,
        customers: 950
      },
      industryAverage: {
        revenue: 42000000,
        growth: 12.5,
        customers: 1050
      },
      insights: [
        'Memiliki pertumbuhan lebih cepat dari industri sebesar 2.7%',
        'Performa customer acquisition unggul 21.4%',
        'ROI marketing lebih efektif dari kompetitor',
        'Revenue per customer unggul 15.4%'
      ],
      recommendations: [
        'Fokus pada customer retention program',
        'Pertimbangkan ekspansi produk ke segmen premium',
        'Analisis kompetitor strategies untuk improvement',
        'Tingkatkan digital marketing efforts'
      ]
    };
  }

  // Simulate real-time analytics updates
  startAnalyticsStream(callback: (data: BusinessAnalytics) => void) {
    const interval = setInterval(async () => {
      const newData = await this.getBusinessAnalytics();
      callback(newData);
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }
}

// Mock data untuk keperluan yang lain
export const mockAnalyticsData = {
  metrics: Math.random() < 0.7 ? 'positive' : 'negative',
  score: Math.floor(Math.random() *30) + 70,
  prediction: Math.random() < 0.6 ? 'increase' : 'decrease'
};

export const analyticsService = new AnalyticsService();