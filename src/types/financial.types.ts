export interface Transaction {
  id: string;
  date: Date;
  type: 'income' | 'expense';
  category: string;
  description: string;
  amount: number;
  paymentMethod: 'cash' | 'transfer' | 'card' | 'e-wallet';
  status: 'completed' | 'pending' | 'cancelled';
  createdBy: string;
}

export interface FinancialSummary {
  totalIncome: number;
  totalExpense: number;
  netProfit: number;
  profitMargin: number;
  transactionCount: number;
  avgTransactionValue: number;
}

export interface CategorySummary {
  category: string;
  amount: number;
  percentage: number;
  transactionCount: number;
  color: string;
}

export interface MonthlyData {
  month: string;
  income: number;
  expense: number;
  profit: number;
}

export interface PaymentMethodSummary {
  method: string;
  amount: number;
  percentage: number;
  count: number;
}

export interface FinancialReport {
  period: {
    startDate: Date;
    endDate: Date;
    label: string;
  };
  summary: FinancialSummary;
  transactions: Transaction[];
  categoryBreakdown: CategorySummary[];
  monthlyData: MonthlyData[];
  paymentMethods: PaymentMethodSummary[];
}

// Update FinancialFilters interface
export interface FinancialFilters {
  startDate?: Date;
  endDate?: Date;
  type?: 'income' | 'expense' | 'all';
  category?: string;
  paymentMethod?: string;
  status?: 'completed' | 'pending' | 'cancelled' | 'all';
  search?: string;
}

// Tambahkan nilai default untuk filters
export const DEFAULT_FINANCIAL_FILTERS: FinancialFilters = {
  type: 'all',
  status: 'all',
  search: '',
  // startDate dan endDate bisa di-set berdasarkan periode default
};

export interface FilterSectionProps {
  filters: FinancialFilters;
  onFilterChange: (filters: Partial<FinancialFilters>) => void;
  onReset: () => void;
  availableCategories?: string[];
  availablePaymentMethods?: string[];
}