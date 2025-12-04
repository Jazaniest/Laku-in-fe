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
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Generate dummy transactions
  private generateTransactions(): Transaction[] {
    const categories = {
      income: ['Penjualan Produk', 'Jasa', 'Investasi', 'Lainnya'],
      expense: ['Pembelian Stok', 'Gaji Karyawan', 'Sewa', 'Utilitas', 'Marketing', 'Transport', 'Lainnya']
    };

    const transactions: Transaction[] = [];
    const today = new Date();

    // Generate 50 transactions for last 30 days
    for (let i = 0; i < 50; i++) {
      const daysAgo = Math.floor(Math.random() * 30);
      const date = new Date(today);
      date.setDate(date.getDate() - daysAgo);

      const type = Math.random() > 0.4 ? 'income' : 'expense';
      const categoriesList = categories[type];
      const category = categoriesList[Math.floor(Math.random() * categoriesList.length)];
      type PaymentMethod = 'cash' | 'transfer' | 'card' | 'e-wallet';
      const methods: PaymentMethod[] = ['cash', 'transfer', 'card', 'e-wallet'];

      transactions.push({
        id: `TRX-${String(i + 1).padStart(4, '0')}`,
        date,
        type,
        category,
        description: `${type === 'income' ? 'Pendapatan' : 'Pengeluaran'} ${category}`,
        amount: Math.floor(Math.random() * 5000000) + 100000,
        paymentMethod: methods[Math.floor(Math.random() * methods.length)],
        status: Math.random() > 0.1 ? 'completed' : 'pending',
        createdBy: 'John Doe'
      });
    }

    return transactions.sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  // Get financial report
  async getFinancialReport(filters?: FinancialFilters): Promise<FinancialReport> {
    await this.delay(800);

    const transactions = this.generateTransactions();
    
    // Apply filters
    let filteredTransactions = [...transactions];
    
    if (filters?.type && filters.type !== 'all') {
      filteredTransactions = filteredTransactions.filter(t => t.type === filters.type);
    }
    
    if (filters?.category) {
      filteredTransactions = filteredTransactions.filter(t => t.category === filters.category);
    }
    
    if (filters?.status && filters.status !== 'all') {
      filteredTransactions = filteredTransactions.filter(t => t.status === filters.status);
    }
    
    if (filters?.search) {
      const search = filters.search.toLowerCase();
      filteredTransactions = filteredTransactions.filter(t => 
        t.description.toLowerCase().includes(search) ||
        t.category.toLowerCase().includes(search) ||
        t.id.toLowerCase().includes(search)
      );
    }

    // Calculate summary
    const summary = this.calculateSummary(filteredTransactions);
    
    // Calculate category breakdown
    const categoryBreakdown = this.calculateCategoryBreakdown(filteredTransactions);
    
    // Calculate monthly data
    const monthlyData = this.calculateMonthlyData(transactions);
    
    // Calculate payment methods
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

  // Calculate summary
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