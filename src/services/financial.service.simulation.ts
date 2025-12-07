import type {
  Transaction,
  FinancialReport,
  FinancialSummary,
  CategorySummary,
  MonthlyData,
  PaymentMethodSummary,
  FinancialFilters
} from '@/types/financial.types';

/**
 * Financial Service Simulasi - Semua data dummy untuk demo
 */
class FinancialService {
  private readonly API_BASE_URL = 'http://localhost:3001';
  private readonly FINANCIAL_ENDPOINTS = {
    financialRecord: '/financial-record'
  } as const;

  // Data transaksi simulasi lengkap
  private mockTransactions: Transaction[] = [
    // Income transactions (Penjualan)
    { id: 'TRX-001', date: new Date('2024-01-01'), type: 'income', category: 'Penjualan Elektronik', description: 'Penjualan Laptop Gaming MSI', amount: 15000000, paymentMethod: 'transfer', status: 'completed', createdBy: 'Demo User' },
    { id: 'TRX-002', date: new Date('2024-01-02'), type: 'income', category: 'Penjualan Elektronik', description: 'Penjualan Monitor 24"', amount: 3000000, paymentMethod: 'transfer', status: 'completed', createdBy: 'Demo User' },
    { id: 'TRX-003', date: new Date('2024-01-03'), type: 'income', category: 'Penjualan Elektronik', description: 'Penjualan Keyboard Mechanical', amount: 1500000, paymentMethod: 'card', status: 'completed', createdBy: 'Demo User' },
    { id: 'TRX-004', date: new Date('2024-01-05'), type: 'income', category: 'Penjualan Fashion', description: 'Penjualan Jaket Kulit', amount: 2800000, paymentMethod: 'cash', status: 'completed', createdBy: 'Demo User' },
    { id: 'TRX-005', date: new Date('2024-01-06'), type: 'income', category: 'Jasa Service', description: 'Jasa Perbaikan Laptop', amount: 800000, paymentMethod: 'transfer', status: 'completed', createdBy: 'Demo User' },
    { id: 'TRX-006', date: new Date('2024-01-07'), type: 'income', category: 'Penjualan Elektronik', description: 'Penjualan Mouse Gaming', amount: 1200000, paymentMethod: 'transfer', status: 'completed', createdBy: 'Demo User' },
    { id: 'TRX-007', date: new Date('2024-01-08'), type: 'income', category: 'Penjualan Fashion', description: 'Penjualan Tas Kantor', amount: 850000, paymentMethod: 'e-wallet', status: 'completed', createdBy: 'Demo User' },
    { id: 'TRX-008', date: new Date('2024-01-09'), type: 'income', category: 'Investasi', description: 'Dividen Saham', amount: 2500000, paymentMethod: 'transfer', status: 'completed', createdBy: 'Demo User' },

    // Expense transactions (Pengeluaran)
    { id: 'TRX-101', date: new Date('2024-01-01'), type: 'expense', category: 'Pembelian Stok', description: 'Pembelian Laptop untuk Stok', amount: 12000000, paymentMethod: 'transfer', status: 'completed', createdBy: 'Demo User' },
    { id: 'TRX-102', date: new Date('2024-01-02'), type: 'expense', category: 'Gaji Karyawan', description: 'Gaji Karyawan Bulanan', amount: 15000000, paymentMethod: 'transfer', status: 'completed', createdBy: 'Demo User' },
    { id: 'TRX-103', date: new Date('2024-01-03'), type: 'expense', category: 'Pembelian Stok', description: 'Pembelian Monitor', amount: 2000000, paymentMethod: 'transfer', status: 'completed', createdBy: 'Demo User' },
    { id: 'TRX-104', date: new Date('2024-01-04'), type: 'expense', category: 'Sewa', description: 'Sewa Gedung Kantor', amount: 5000000, paymentMethod: 'transfer', status: 'completed', createdBy: 'Demo User' },
    { id: 'TRX-105', date: new Date('2024-01-05'), type: 'expense', category: 'Utilitas', description: 'Listrik dan Air', amount: 1500000, paymentMethod: 'transfer', status: 'completed', createdBy: 'Demo User' },
    { id: 'TRX-106', date: new Date('2024-01-06'), type: 'expense', category: 'Marketing', description: 'Iklan Instagram', amount: 800000, paymentMethod: 'card', status: 'completed', createdBy: 'Demo User' },
    { id: 'TRX-107', date: new Date('2024-01-07'), type: 'expense', category: 'Transport', description: 'Bensin dan Parkir', amount: 600000, paymentMethod: 'cash', status: 'completed', createdBy: 'Demo User' },
    { id: 'TRX-108', date: new Date('2024-01-08'), type: 'expense', category: 'Maintenance', description: 'Service Lantai dan AC', amount: 900000, paymentMethod: 'transfer', status: 'completed', createdBy: 'Demo User' },
    { id: 'TRX-109', date: new Date('2024-01-09'), type: 'expense', category: 'Pembelian Stok', description: 'Restock Keyboard', amount: 750000, paymentMethod: 'card', status: 'pending', createdBy: 'Demo User' },
    { id: 'TRX-110', date: new Date('2024-01-10'), type: 'expense', category: 'Marketing', description: 'Banner Promosi', amount: 400000, paymentMethod: 'cash', status: 'completed', createdBy: 'Demo User' },
    { id: 'TRX-111', date: new Date('2024-01-11'), type: 'expense', category: 'Pelatihan', description: 'Workshop Team Building', amount: 1200000, paymentMethod: 'transfer', status: 'completed', createdBy: 'Demo User' },
    { id: 'TRX-112', date: new Date('2024-01-12'), type: 'expense', category: 'Pembelian Stok', description: 'Restock Jaket', amount: 1200000, paymentMethod: 'transfer', status: 'completed', createdBy: 'Demo User' }
  ];

  /**
   * API call simulasi
   */
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
   * Generate transactions (untuk demo)
   */
  private generateTransactions(): Transaction[] {
    return [...this.mockTransactions].sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  /**
   * Get all financial records (financial-record endpoint)
   */
  async getFinancialRecords(): Promise<any[]> {
    try {
      await this.apiCall<any[]>(this.FINANCIAL_ENDPOINTS.financialRecord, {
        method: 'GET'
      });
      return this.mockTransactions;
    } catch (error) {
      console.warn('API call failed, using fallback:', error);
      return this.mockTransactions;
    }
  }

  /**
   * Get single financial record
   */
  async getFinancialRecord(id: string): Promise<any> {
    try {
      await this.apiCall<any>(`${this.FINANCIAL_ENDPOINTS.financialRecord}/${id}`, {
        method: 'GET'
      });
      
      const record = this.mockTransactions.find(t => t.id === id);
      return record || this.mockTransactions[0];
    } catch (error) {
      console.warn('Get financial record API call failed, using fallback:', error);
      const record = this.mockTransactions.find(t => t.id === id);
      return record || this.mockTransactions[0];
    }
  }

  /**
   * Create financial record
   */
  async createFinancialRecord(data: any): Promise<any> {
    try {
      await this.apiCall<any>(this.FINANCIAL_ENDPOINTS.financialRecord, {
        method: 'POST',
        body: JSON.stringify(data || {})
      });
      
      const newRecord = {
        id: `FIN-${Date.now()}`,
        ...data,
        date: new Date(data.date) || new Date(),
        createdBy: 'Demo User',
        createdAt: new Date()
      };
      
      this.mockTransactions.push(newRecord);
      return newRecord;
    } catch (error) {
      console.warn('Create financial record API call failed, using fallback:', error);
      const newRecord = {
        id: `FIN-${Date.now()}`,
        ...data,
        date: new Date(data.date) || new Date(),
        createdBy: 'Demo User',
        createdAt: new Date()
      };
      return newRecord;
    }
  }

  /**
   * Update financial record
   */
  async updateFinancialRecord(id: string, data: any): Promise<any> {
    try {
      await this.apiCall<any>(`${this.FINANCIAL_ENDPOINTS.financialRecord}/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data)
      });
      
      const index = this.mockTransactions.findIndex(t => t.id === id);
      if (index !== -1) {
        this.mockTransactions[index] = { ...this.mockTransactions[index], ...data, updatedAt: new Date() };
        return this.mockTransactions[index];
      }
      
      return { id, ...data, updatedAt: new Date() };
    } catch (error) {
      console.warn('Update financial record API call failed, using fallback:', error);
      return { id, ...data, updatedAt: new Date() };
    }
  }

  /**
   * Delete financial record
   */
  async deleteFinancialRecord(id: string): Promise<boolean> {
    try {
      const response = await this.apiCall<{ success: boolean }>(`${this.FINANCIAL_ENDPOINTS.financialRecord}/${id}`, {
        method: 'DELETE'
      });
      return response.success;
    } catch (error) {
      console.warn('Delete financial record API call failed, using fallback:', error);
      const initialLength = this.mockTransactions.length;
      this.mockTransactions = this.mockTransactions.filter(t => t.id !== id);
      return initialLength !== this.mockTransactions.length;
    }
  }

  /**
   * Get financial report
   */
  async getFinancialReport(filters?: FinancialFilters): Promise<FinancialReport> {
    // Simulasi delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const transactions = this.generateTransactions();

    // Apply filters
    let filteredTransactions = [...transactions];

    // Filter by type
    if (filters?.type && filters.type !== 'all') {
      filteredTransactions = filteredTransactions.filter(t => t.type === filters.type);
    }

    // Filter by category
    if (filters?.category && filters.category !== '') {
      filteredTransactions = filteredTransactions.filter(t =>
        t.category.toLowerCase() === filters.category?.toLowerCase()
      );
    }

    // Filter by status
    if (filters?.status && filters.status !== 'all') {
      filteredTransactions = filteredTransactions.filter(t => t.status === filters.status);
    }

    // Filter by payment method
    if (filters?.paymentMethod && filters.paymentMethod !== '') {
      filteredTransactions = filteredTransactions.filter(t =>
        t.paymentMethod === filters.paymentMethod
      );
    }

    // Filter by search (case-insensitive, multiple fields)
    if (filters?.search && filters.search.trim() !== '') {
      const search = filters.search.toLowerCase().trim();
      const searchWords = search.split(/\s+/);
      filteredTransactions = filteredTransactions.filter(t =>
        searchWords.some(word =>
          t.description.toLowerCase().includes(word) ||
          t.category.toLowerCase().includes(word) ||
          t.id.toLowerCase().includes(word)
        )
      );
    }

    // Filter by date range
    if (filters?.startDate || filters?.endDate) {
      filteredTransactions = filteredTransactions.filter(t => {
        const transactionDate = new Date(t.date);
        if (filters.startDate && transactionDate < new Date(filters.startDate)) return false;
        if (filters.endDate) {
          const endDate = new Date(filters.endDate);
          endDate.setHours(23, 59, 59, 999);
          if (transactionDate > endDate) return false;
        }
        return true;
      });
    }

    // Calculate summary
    const summary = this.calculateSummary(filteredTransactions);
    const categoryBreakdown = this.calculateCategoryBreakdown(filteredTransactions);
    const monthlyData = this.calculateMonthlyData(transactions);
    const paymentMethods = this.calculatePaymentMethods(filteredTransactions);

    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    return {
      period: {
        startDate: filters?.startDate || thirtyDaysAgo,
        endDate: filters?.endDate || today,
        label: filters?.startDate && filters?.endDate 
          ? `Periode: ${filters.startDate} - ${filters.endDate}`
          : '30 Hari Terakhir'
      },
      summary,
      transactions: filteredTransactions,
      categoryBreakdown,
      monthlyData,
      paymentMethods
    };
  }

  /**
   * Calculate financial summary
   */
  private calculateSummary(transactions: Transaction[]): FinancialSummary {
    const completedTransactions = transactions.filter(t => t.status === 'completed');

    const totalIncome = completedTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = completedTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalBalance = totalIncome - totalExpense;

    return {
      totalIncome,
      totalExpense,
      totalBalance,
      totalTransactions: completedTransactions.length,
      averageTransaction: completedTransactions.length > 0 ? (totalIncome + totalExpense) / completedTransactions.length : 0,
      balancePercentage: totalBalance === 0 ? 0 : (totalBalance / totalIncome) * 100,
      pendingTransactions: transactions.filter(t => t.status === 'pending').length
    };
  }

  /**
   * Calculate category breakdown
   */
  private calculateCategoryBreakdown(transactions: Transaction[]): CategorySummary[] {
    const grouped = transactions.reduce((acc, t) => {
      if (t.status === 'completed') {
        const current = acc.get(t.category) || { income: 0, expense: 0 };
        if (t.type === 'income') {
          current.income += t.amount;
        } else {
          current.expense += t.amount;
        }
        acc.set(t.category, current);
      }
      return acc;
    }, new Map<string, { income: number; expense: number }>());

    return Array.from(grouped.entries()).map(([category, { income, expense }]) => ({
      category,
      total: income + expense,
      income,
      expense,
      balance: income - expense
    }));
  }

  /**
   * Calculate monthly data
   */
  private calculateMonthlyData(transactions: Transaction[]): MonthlyData[] {
    const currentDate = new Date();
    const months = [];
    
    for (let i = 5; i >= 0; i--) {
      const month = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      months.push(month);
    }

    return months.map(month => {
      const monthStart = new Date(month.getFullYear(), month.getMonth(), 1);
      const monthEnd = new Date(month.getFullYear(), month.getMonth() + 1, 0);
      
      const monthTransactions = transactions.filter(t => 
        t.date >= monthStart && t.date <= monthEnd && t.status === 'completed'
      );
      
      const income = monthTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
      
      const expense = monthTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
      
      return {
        month: month.toLocaleString('id-ID', { month: 'short', year: 'numeric' }),
        income,
        expense,
        profit: income - expense
      };
    });
  }

  /**
   * Calculate payment method summary
   */
  private calculatePaymentMethods(transactions: Transaction[]): PaymentMethodSummary[] {
    const methodTotals = transactions.reduce((acc, t) => {
      acc[t.paymentMethod] = (acc[t.paymentMethod] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(methodTotals).map(([method, total]) => ({
      method,
      total,
      percentage: Object.keys(methodTotals).length === 0 ? 0 : (total / Object.values(methodTotals).reduce((sum, t) => sum + t, 0)) * 100
    }));
  }

  /**
   * Generate financial analytics with AI insights
   */
  async generateFinancialAnalytics(startDate: string, endDate: string) {
    try {
      const report = await this.getFinancialReport({ startDate, endDate });
      
      // Simulasi analisis AI
      return {
        ...report,
        insights: [
          'Cash flow Anda stabil dengan profit margin 42.5%',
          'Income terbanyak dari kategori Penjualan Elektronik',
          'Pertimbangkan meningkatkan efisiensi operasional',
          'Gunakan metode pembayaran digital untuk efisiensi'
        ],
        recommendations: [
          'Fokus pada kategori yang memberikan ROI tertinggi',
          'Review biaya operasional secara berkala',
          'Pertimbangkan untuk meningkatkan harga jual moderat',
          'Gunakan data untuk pengambilan keputusan strategis'
        ],
        aiAnalysis: {
          score: Math.floor(Math.random() * 30) + 70,
          status: 'healthy',
          confidence: Math.floor(Math.random() * 20) + 80
        }
      };
    } catch (error) {
      console.error('Financial analytics error:', error);
      throw error;
    }
  }

  /**
   * Generate budget forecast
   */
  async generateBudgetForecast(startDate: string, endDate: string) {
    const baseReport = await this.getFinancialReport({ startDate, endDate });
    
    // Generate predictions based on historical data
    const dayCount = Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 3600 * 24));
    const monthlyFactor = dayCount / 30;
    
    return {
      incomeForecast: baseReport.summary.totalIncome * monthlyFactor * (0.9 + Math.random() * 0.2),
      expenseForecast: baseReport.summary.totalExpense * monthlyFactor * (0.85 + Math.random() * 0.3),
      profitForecast: baseReport.summary.totalBalance * monthlyFactor * (0.8 + Math.random() * 0.4),
      period: `Forecast ${startDate} - ${endDate}`,
      accuracy: Math.floor(Math.random() * 10) + 85 // 85-95%
    };
  }
}

export const financialService = new FinancialService();