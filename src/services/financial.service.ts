import type {
  Transaction,
  FinancialReport,
  FinancialSummary,
  CategorySummary,
  MonthlyData,
  PaymentMethodSummary,
  FinancialFilters
} from '@/types/financial.types';

class FinancialService {
  private readonly API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
  private readonly FINANCIAL_ENDPOINTS = {
    financialRecord: '/financial-record'
  } as const;

  // Add API call method
  private async apiCall<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.API_BASE_URL}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...(options.headers || {})
        },
        credentials: 'include'
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch')) {
          throw new Error('Gagal terhubung ke server keuangan. Periksa koneksi internet Anda.');
        }
      }
      throw error;
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Fixed simulation data untuk testing
  private mockTransactions: Transaction[] = [
    // Income transactions
    { id: 'TRX-0001', date: new Date('2024-01-15'), type: 'income', category: 'Penjualan Produk', description: 'Penjualan Produk - Laptop', amount: 15000000, paymentMethod: 'transfer', status: 'completed', createdBy: 'John Doe' },
    { id: 'TRX-0002', date: new Date('2024-01-18'), type: 'income', category: 'Jasa', description: 'Jasa - Konsultasi IT', amount: 5000000, paymentMethod: 'transfer', status: 'completed', createdBy: 'John Doe' },
    { id: 'TRX-0003', date: new Date('2024-01-20'), type: 'income', category: 'Penjualan Produk', description: 'Penjualan Produk - Monitor', amount: 3000000, paymentMethod: 'card', status: 'completed', createdBy: 'John Doe' },
    { id: 'TRX-0004', date: new Date('2024-01-22'), type: 'income', category: 'Investasi', description: 'Investasi - Dividen Saham', amount: 2500000, paymentMethod: 'transfer', status: 'completed', createdBy: 'John Doe' },
    { id: 'TRX-0005', date: new Date('2024-01-25'), type: 'income', category: 'Jasa', description: 'Jasa - Pelatihan Karyawan', amount: 8000000, paymentMethod: 'transfer', status: 'completed', createdBy: 'John Doe' },
    { id: 'TRX-0006', date: new Date('2024-01-28'), type: 'income', category: 'Penjualan Produk', description: 'Penjualan Produk - Keyboard', amount: 1500000, paymentMethod: 'cash', status: 'completed', createdBy: 'John Doe' },

    // Expense transactions
    { id: 'TRX-0007', date: new Date('2024-01-05'), type: 'expense', category: 'Pembelian Stok', description: 'Pembelian Stok - Hardware Komputer', amount: 20000000, paymentMethod: 'transfer', status: 'completed', createdBy: 'John Doe' },
    { id: 'TRX-0008', date: new Date('2024-01-10'), type: 'expense', category: 'Gaji Karyawan', description: 'Gaji Karyawan - Januari', amount: 25000000, paymentMethod: 'transfer', status: 'completed', createdBy: 'John Doe' },
    { id: 'TRX-0009', date: new Date('2024-01-12'), type: 'expense', category: 'Sewa', description: 'Sewa - Kantor Bulanan', amount: 5000000, paymentMethod: 'transfer', status: 'completed', createdBy: 'John Doe' },
    { id: 'TRX-0010', date: new Date('2024-01-14'), type: 'expense', category: 'Utilitas', description: 'Utilitas - Listrik dan Air', amount: 2000000, paymentMethod: 'transfer', status: 'completed', createdBy: 'John Doe' },
    { id: 'TRX-0011', date: new Date('2024-01-16'), type: 'expense', category: 'Marketing', description: 'Marketing - Iklan Digital', amount: 3000000, paymentMethod: 'card', status: 'completed', createdBy: 'John Doe' },
    { id: 'TRX-0012', date: new Date('2024-01-19'), type: 'expense', category: 'Transport', description: 'Transport - Bensin Kendaraan', amount: 500000, paymentMethod: 'cash', status: 'completed', createdBy: 'John Doe' },
    { id: 'TRX-0013', date: new Date('2024-01-21'), type: 'expense', category: 'Pembelian Stok', description: 'Pembelian Stok - Software License', amount: 2500000, paymentMethod: 'transfer', status: 'completed', createdBy: 'John Doe' },
    { id: 'TRX-0014', date: new Date('2024-01-23'), type: 'expense', category: 'Utilitas', description: 'Utilitas - Internet dan Telepon', amount: 1000000, paymentMethod: 'transfer', status: 'pending', createdBy: 'John Doe' },
    { id: 'TRX-0015', date: new Date('2024-01-24'), type: 'expense', category: 'Marketing', description: 'Marketing - Banner Cetak', amount: 1500000, paymentMethod: 'transfer', status: 'completed', createdBy: 'John Doe' },
    { id: 'TRX-0016', date: new Date('2024-01-26'), type: 'expense', category: 'Lainnya', description: 'Lainnya - Asuransi Kendaraan', amount: 800000, paymentMethod: 'card', status: 'completed', createdBy: 'John Doe' },

    // More transactions for variety
    { id: 'TRX-0017', date: new Date('2024-01-27'), type: 'income', category: 'Lainnya', description: 'Lainnya - Komisi Penjualan', amount: 4000000, paymentMethod: 'transfer', status: 'completed', createdBy: 'John Doe' },
    { id: 'TRX-0018', date: new Date('2024-01-29'), type: 'expense', category: 'Transport', description: 'Transport - Maintenance Kendaraan', amount: 2000000, paymentMethod: 'cash', status: 'completed', createdBy: 'John Doe' },
    { id: 'TRX-0019', date: new Date('2024-01-30'), type: 'income', category: 'Penjualan Produk', description: 'Penjualan Produk - Mouse Wireless', amount: 2000000, paymentMethod: 'e-wallet', status: 'completed', createdBy: 'John Doe' },
    { id: 'TRX-0020', date: new Date('2024-01-31'), type: 'expense', category: 'Pembelian Stok', description: 'Pembelian Stok - Peripheral Komputer', amount: 5000000, paymentMethod: 'transfer', status: 'completed', createdBy: 'John Doe' },

    // Previous month data
    { id: 'TRX-0021', date: new Date('2023-12-28'), type: 'income', category: 'Penjualan Produk', description: 'Penjualan Produk - Desktop PC', amount: 12000000, paymentMethod: 'transfer', status: 'completed', createdBy: 'John Doe' },
    { id: 'TRX-0022', date: new Date('2023-12-29'), type: 'expense', category: 'Gaji Karyawan', description: 'Gaji Karyawan - Bonus Desember', amount: 10000000, paymentMethod: 'transfer', status: 'completed', createdBy: 'John Doe' },
    { id: 'TRX-0023', date: new Date('2023-12-30'), type: 'income', category: 'Jasa', description: 'Jasa - Support Teknis', amount: 3500000, paymentMethod: 'transfer', status: 'completed', createdBy: 'John Doe' },
    { id: 'TRX-0024', date: new Date('2023-12-31'), type: 'expense', category: 'Sewa', description: 'Sewa - Kantor Desember', amount: 5000000, paymentMethod: 'transfer', status: 'completed', createdBy: 'John Doe' },

    // Cancelled transaction
    { id: 'TRX-0025', date: new Date('2024-01-17'), type: 'expense', category: 'Marketing', description: 'Marketing - Event Sponsorship', amount: 5000000, paymentMethod: 'transfer', status: 'cancelled', createdBy: 'John Doe' },
  ];

  // Get all financial records - GET /financial-record
  async getFinancialRecords(): Promise<any[]> {
    try {
      return await this.apiCall<any[]>(this.FINANCIAL_ENDPOINTS.financialRecord, {
        method: 'GET'
      });
    } catch (error) {
      console.warn('Get financial records API call failed, using fallback:', error);
      return this.generateTransactions();
    }
  }

  // Get single financial record - GET /financial-record/:id
  async getFinancialRecord(id: string): Promise<any> {
    try {
      return await this.apiCall<any>(`${this.FINANCIAL_ENDPOINTS.financialRecord}/${id}`, {
        method: 'GET'
      });
    } catch (error) {
      console.warn('Get financial record API call failed, using fallback:', error);
      const transactions = this.generateTransactions();
      return transactions.find(t => t.id === id) || transactions[0];
    }
  }

  // Create financial record - POST /financial-record
  async createFinancialRecord(data: any): Promise<any> {
    try {
      return await this.apiCall<any>(this.FINANCIAL_ENDPOINTS.financialRecord, {
        method: 'POST',
        body: JSON.stringify(data || {})
      });
    } catch (error) {
      console.warn('Create financial record API call failed, using fallback:', error);
      const newRecord = {
        id: `FIN-${Date.now()}`,
        ...data,
        createdAt: new Date()
      };
      return newRecord;
    }
  }

  // Update financial record - PATCH /financial-record/:id
  async updateFinancialRecord(id: string, data: any): Promise<any> {
    try {
      return await this.apiCall<any>(`${this.FINANCIAL_ENDPOINTS.financialRecord}/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data)
      });
    } catch (error) {
      console.warn('Update financial record API call failed, using fallback:', error);
      return {
        id,
        ...data,
        updatedAt: new Date()
      };
    }
  }

  // Delete financial record - DELETE /financial-record/:id
  async deleteFinancialRecord(id: string): Promise<boolean> {
    try {
      const response = await this.apiCall<{ success: boolean }>(`${this.FINANCIAL_ENDPOINTS.financialRecord}/${id}`, {
        method: 'DELETE'
      });
      return response.success;
    } catch (error) {
      console.warn('Delete financial record API call failed, using fallback:', error);
      return true;
    }
  }
  private generateTransactions(): Transaction[] {
    return [...this.mockTransactions].sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  // Get financial report
  async getFinancialReport(filters?: FinancialFilters): Promise<FinancialReport> {
    await this.delay(800);

    const transactions = this.generateTransactions();

    // Apply filters in correct order
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
      filteredTransactions = filteredTransactions.filter(t =>
        t.description.toLowerCase().includes(search) ||
        t.category.toLowerCase().includes(search) ||
        t.id.toLowerCase().includes(search) ||
        t.paymentMethod.toLowerCase().includes(search)
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

    // Calculate summary FROM FILTERED TRANSACTIONS
    const summary = this.calculateSummary(filteredTransactions);

    // Calculate category breakdown FROM FILTERED TRANSACTIONS
    const categoryBreakdown = this.calculateCategoryBreakdown(filteredTransactions);

    // Calculate monthly data FROM ALL TRANSACTIONS (for chart context)
    const monthlyData = this.calculateMonthlyData(transactions);

    // Calculate payment methods FROM FILTERED TRANSACTIONS
    const paymentMethods = this.calculatePaymentMethods(filteredTransactions);

    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    return {
      period: {
        startDate: filters?.startDate || thirtyDaysAgo,
        endDate: filters?.endDate || today,
        label: '30 Hari Terakhir'
      },
      summary,
      transactions: filteredTransactions,
      categoryBreakdown,
      monthlyData,
      paymentMethods
    };
  }

  // Calculate summary - SUDAH MENERIMA FILTERED TRANSACTIONS
  private calculateSummary(transactions: Transaction[]): FinancialSummary {
    const completedTransactions = transactions.filter(t => t.status === 'completed');

    const totalIncome = completedTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = completedTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const netProfit = totalIncome - totalExpense;
    const profitMargin = totalIncome > 0 ? (netProfit / totalIncome) * 100 : 0;

    return {
      totalIncome,
      totalExpense,
      netProfit,
      profitMargin,
      transactionCount: completedTransactions.length,
      avgTransactionValue: completedTransactions.length > 0
        ? (totalIncome + totalExpense) / completedTransactions.length
        : 0
    };
  }

  // Calculate category breakdown
  private calculateCategoryBreakdown(transactions: Transaction[]): CategorySummary[] {
    const categoryMap = new Map<string, { amount: number; count: number }>();
    const colors = [
      '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
      '#ec4899', '#14b8a6', '#f97316', '#06b6d4', '#84cc16'
    ];

    transactions
      .filter(t => t.status === 'completed')
      .forEach(t => {
        const current = categoryMap.get(t.category) || { amount: 0, count: 0 };
        categoryMap.set(t.category, {
          amount: current.amount + t.amount,
          count: current.count + 1
        });
      });

    const total = Array.from(categoryMap.values()).reduce((sum, v) => sum + v.amount, 0);

    return Array.from(categoryMap.entries())
      .map(([category, data], index) => ({
        category,
        amount: data.amount,
        percentage: total > 0 ? (data.amount / total) * 100 : 0,
        transactionCount: data.count,
        color: colors[index % colors.length]
      }))
      .sort((a, b) => b.amount - a.amount);
  }

  // Calculate monthly data
  private calculateMonthlyData(transactions: Transaction[]): MonthlyData[] {
    const monthMap = new Map<string, { income: number; expense: number }>();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

    transactions
      .filter(t => t.status === 'completed')
      .forEach(t => {
        const monthKey = `${months[t.date.getMonth()]} ${t.date.getFullYear()}`;
        const current = monthMap.get(monthKey) || { income: 0, expense: 0 };

        if (t.type === 'income') {
          current.income += t.amount;
        } else {
          current.expense += t.amount;
        }

        monthMap.set(monthKey, current);
      });

    return Array.from(monthMap.entries())
      .map(([month, data]) => ({
        month,
        income: data.income,
        expense: data.expense,
        profit: data.income - data.expense
      }))
      .sort((a, b) => {
        const [monthA, yearA] = a.month.split(' ');
        const [monthB, yearB] = b.month.split(' ');
        const dateA = new Date(`${monthA} 1, ${yearA}`);
        const dateB = new Date(`${monthB} 1, ${yearB}`);
        return dateA.getTime() - dateB.getTime();
      })
      .slice(-6); // Last 6 months
  }

  // Calculate payment methods
  private calculatePaymentMethods(transactions: Transaction[]): PaymentMethodSummary[] {
    const methodMap = new Map<string, { amount: number; count: number }>();
    const methodLabels: Record<string, string> = {
      cash: 'Tunai',
      transfer: 'Transfer Bank',
      card: 'Kartu Kredit/Debit',
      'e-wallet': 'E-Wallet'
    };

    transactions
      .filter(t => t.status === 'completed')
      .forEach(t => {
        const current = methodMap.get(t.paymentMethod) || { amount: 0, count: 0 };
        methodMap.set(t.paymentMethod, {
          amount: current.amount + t.amount,
          count: current.count + 1
        });
      });

    const total = Array.from(methodMap.values()).reduce((sum, v) => sum + v.amount, 0);

    return Array.from(methodMap.entries())
      .map(([method, data]) => ({
        method: methodLabels[method] || method,
        amount: data.amount,
        percentage: total > 0 ? (data.amount / total) * 100 : 0,
        count: data.count
      }))
      .sort((a, b) => b.amount - a.amount);
  }

  // Get transaction detail
  async getTransactionDetail(transactionId: string): Promise<Transaction | null> {
    await this.delay(300);
    const transactions = this.generateTransactions();
    return transactions.find(t => t.id === transactionId) || null;
  }

  // Create transaction
  async createTransaction(transaction: Omit<Transaction, 'id' | 'createdBy'>): Promise<Transaction> {
    await this.delay(500);

    const newTransaction: Transaction = {
      ...transaction,
      id: `TRX-${Date.now()}`,
      createdBy: 'John Doe'
    };

    console.log('Created transaction:', newTransaction);
    return newTransaction;
  }

  // Update transaction
  async updateTransaction(transactionId: string, updates: Partial<Transaction>): Promise<Transaction> {
    await this.delay(500);

    const transaction = await this.getTransactionDetail(transactionId);
    if (!transaction) {
      throw new Error('Transaction not found');
    }

    const updatedTransaction = { ...transaction, ...updates };
    console.log('Updated transaction:', updatedTransaction);
    return updatedTransaction;
  }

  // Delete transaction
  async deleteTransaction(transactionId: string): Promise<boolean> {
    await this.delay(400);
    console.log('Deleted transaction:', transactionId);
    return true;
  }

  // Export report
  async exportReport(format: 'pdf' | 'excel', filters?: FinancialFilters): Promise<string> {
    await this.delay(1000);
    console.log(`Exporting report as ${format}`, filters);
    return `report_${Date.now()}.${format === 'pdf' ? 'pdf' : 'xlsx'}`;
  }

  // Get categories
  async getCategories(type?: 'income' | 'expense'): Promise<string[]> {
    await this.delay(200);

    const categories = {
      income: ['Penjualan Produk', 'Jasa', 'Investasi', 'Lainnya'],
      expense: ['Pembelian Stok', 'Gaji Karyawan', 'Sewa', 'Utilitas', 'Marketing', 'Transport', 'Lainnya']
    };

    if (type) {
      return categories[type];
    }

    return [...categories.income, ...categories.expense];
  }
}

export const financialService = new FinancialService();