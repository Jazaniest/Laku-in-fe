/**
 * Business Analytics Service Simulasi - Semua data dummy untuk demo
 */

interface BusinessSummaryResponse {
  totalRevenue: number;
  totalTransactions: number;
  totalCustomers: number;
  averageOrderValue: number;
  period: string;
}

interface FinancialSummaryResponse {
  revenue: number;
  expense: number;
  profit: number;
  profitMargin: number;
  startDate: string;
  endDate: string;
}

class BusinessAnalyticsService {
  private readonly API_BASE_URL = 'http://localhost:3001';
  private readonly ENDPOINTS = {
    summary: '/business-analytics/summary',
    financialSummary: '/business-analytics/financial-summary'
  } as const;

  private async apiCall<T>(_endpoint: string, _options: RequestInit = {}): Promise<T> {
    // Simulasi network delay
    await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 700));
    
    // Simulate network errors occasionally
    if (Math.random() < 0.03) {
      throw new Error('Connection timeout');
    }
    
    return {} as T;
  }

  /**
   * Get business summary - GET /business-analytics/summary
   * Data simulasi yang realistis
   */
  async getBusinessSummary(phone: string, limit?: string, days?: string): Promise<BusinessSummaryResponse> {
    try {
      await this.apiCall<BusinessSummaryResponse>(this.ENDPOINTS.summary, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      // Generate data berdasarkan parameter
      const baseValues = this.generateBusinessData(phone, days);
      const multiplier = limit ? parseInt(limit) / 100 : 1;
      
      return {
        totalRevenue: baseValues.totalRevenue * multiplier,
        totalTransactions: Math.floor(baseValues.totalTransactions * multiplier),
        totalCustomers: Math.floor(baseValues.totalCustomers * multiplier),
        averageOrderValue: baseValues.averageOrderValue,
        period: days ? `${days} days` : '30 days'
      };
    } catch (error) {
      console.warn('Get business summary API call failed, using fallback:', error);
      
      // Default fallback data
      return {
        totalRevenue: 250000000,
        totalTransactions: 156,
        totalCustomers: 89,
        averageOrderValue: 1602564,
        period: days ? `${days} days` : '30 days'
      };
    }
  }

  /**
   * Get financial summary - GET /business-analytics/financial-summary
   */
  async getFinancialSummary(startDate: string, endDate: string): Promise<FinancialSummaryResponse> {
    try {
      await this.apiCall<FinancialSummaryResponse>(this.ENDPOINTS.financialSummary, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      // Generate data berdasarkan periode
      const dayDiff = this.dayDifference(startDate, endDate);
      const baseRevenue = 8000000 * dayDiff;
      const baseExpense = baseRevenue * 0.62; // 62% expense ratio
      const baseProfit = baseRevenue - baseExpense;
      
      return {
        revenue: baseRevenue + Math.random() * baseRevenue * 0.2, // Tambah variance
        expense: baseExpense + Math.random() * baseExpense * 0.15,
        profit: baseProfit + Math.random() * baseProfit * 0.25,
        profitMargin: 38 + Math.random() * 10, // 38-48%
        startDate: startDate,
        endDate: endDate
      };
    } catch (error) {
      console.warn('Get financial summary API call failed, using fallback:', error);
      return {
        revenue: 100000000,
        expense: 60000000,
        profit: 40000000,
        profitMargin: 40,
        startDate: startDate,
        endDate: endDate
      };
    }
  }

  /**
   * Hitung selisih hari antara dua tanggal
   */
  private dayDifference(startDate: string, endDate: string): number {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
  }

  /**
   * Generate data bisnis nyata berdasarkan parameter
   */
  private generateBusinessData(phone: string, days?: string) {
    // Generate seed dari phone untuk konsistensi data
    const seed = parseInt(phone.replace(/\D/g, '').slice(-6)) || 123456;
    const multiplier = days ? parseInt(days) / 30 : 1; // Normalisasi per bulan

    // Gunakan seed untuk data yang konsisten
    const baseRevenue = 8000000 * multiplier;
    const transactions = Math.floor(seed % 100 + 80 * multiplier);
    const customers = Math.floor(transactions * 0.6); // Rough conversion
    const aov = Math.floor(baseRevenue / transactions);

    return {
      totalRevenue: baseRevenue + (seed % 1000000),
      totalTransactions: transactions,
      totalCustomers: customers,
      averageOrderValue: aov
    };
  }
}

export const businessAnalyticsService = new BusinessAnalyticsService();