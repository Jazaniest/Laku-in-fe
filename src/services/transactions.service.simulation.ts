import type {
  Transaction,
  CreateTransactionRequest
} from '@/types/transactions.types';

/**
 * Transactions Service Simulasi - Semua data dummy untuk demo
 */
class TransactionsService {
  private readonly API_BASE_URL = 'http://localhost:3001';
  private readonly TRANSACTIONS_ENDPOINTS = {
    transactions: '/transactions'
  } as const;

  // Data transaksi simulasi
  private mockTransactions: Transaction[] = [
    {
      id: 'TRX-001202401150001',
      item_name: 'Laptop Gaming MSI Stealth',
      quantity: 2,
      unit_price: 15000000,
      subtotal: 30000000,
      sale_date: new Date('2024-01-15T10:30:00'),
      created_at: new Date('2024-01-15T10:35:00'),
      customer: { name: 'Ahmad Fauzan', phone: '+6281234567890' }
    },
    {
      id: 'TRX-001202401160002',
      item_name: 'Monitor 24" Samsung Curved',
      quantity: 1,
      unit_price: 3000000,
      subtotal: 3000000,
      sale_date: new Date('2024-01-16T14:20:00'),
      created_at: new Date('2024-01-16T14:25:00'),
      customer: { name: 'Budi Santoso', phone: '+6289876543210' }
    },
    {
      id: 'TRX-001202401170003',
      item_name: 'Keyboard Razer Mechanical',
      quantity: 3,
      unit_price: 1500000,
      subtotal: 4500000,
      sale_date: new Date('2024-01-17T09:15:00'),
      created_at: new Date('2024-01-17T09:20:00'),
      customer: { name: 'Cindy Amelia', phone: '+6285555555555' }
    },
    {
      id: 'TRX-001202401180004',
      item_name: 'iPhone 15 Pro Max',
      quantity: 1,
      unit_price: 25000000,
      subtotal: 25000000,
      sale_date: new Date('2024-01-18T16:45:00'),
      created_at: new Date('2024-01-18T16:50:00'),
      customer: { name: 'Diana Putri', phone: '+6281234567890' }
    },
    {
      id: 'TRX-001202401190005',
      item_name: 'Mouse Logitech Gaming',
      quantity: 2,
      unit_price: 1200000,
      subtotal: 2400000,
      sale_date: new Date('2024-01-19T11:30:00'),
      created_at: new Date('2024-01-19T11:35:00'),
      customer: { name: 'Eko Pratama', phone: '+6289876543210' }
    },
    {
      id: 'TRX-001202401200006',
      item_name: 'Tas Kantor Premium',
      quantity: 1,
      unit_price: 850000,
      subtotal: 850000,
      sale_date: new Date('2024-01-20T13:20:00'),
      created_at: new Date('2024-01-20T13:25:00'),
      customer: { name: 'Fitriani Kusuma', phone: '+6285555555555' }
    },
    {
      id: 'TRX-001202401210007',
      item_name: 'Jaket Kulit',
      quantity: 1,
      unit_price: 2800000,
      subtotal: 2800000,
      sale_date: new Date('2024-01-21T15:10:00'),
      created_at: new Date('2024-01-21T15:15:00'),
      customer: { name: 'Gilang Ramadhan', phone: '+6281234567890' }
    },
    {
      id: 'TRX-001202401220008',
      item_name: 'Kemeja Formal',
      quantity: 3,
      unit_price: 450000,
      subtotal: 1350000,
      sale_date: new Date('2024-01-22T10:45:00'),
      created_at: new Date('2024-01-22T10:50:00'),
      customer: { name: 'Hadi Wijaya', phone: '+6289876543210' }
    },
    {
      id: 'TRX-001202401230009',
      item_name: 'Jam Tangan Pria',
      quantity: 1,
      unit_price: 3500000,
      subtotal: 3500000,
      sale_date: new Date('2024-01-23T08:30:00'),
      created_at: new Date('2024-01-23T08:35:00'),
      customer: { name: 'Irfan Saputra', phone: '+6285555555555' }
    },
    {
      id: 'TRX-001202401240010',
      item_name: 'Headset Gaming',
      quantity: 2,
      unit_price: 1800000,
      subtotal: 3600000,
      sale_date: new Date('2024-01-24T17:20:00'),
      created_at: new Date('2024-01-24T17:25:00'),
      customer: { name: 'Joko Susilo', phone: '+6281234567890' }
    }
  ];

  /**
   * API call simulasi
   */
  private async apiCall<T>(_endpoint: string, _options: RequestInit = {}): Promise<T> {
    // Simulasi network delay
    await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 800));
    
    // Simulate network errors occasionally
    if (Math.random() < 0.03) {
      throw new Error('Connection timeout');
    }
    
    return {} as T;
  }

  /**
   * Get auth token
   */
  private getAuthToken(): string {
    return localStorage.getItem('auth_token') || 'demo-token';
  }

  /**
   * Get all transactions
   */
  async getTransactions(): Promise<Transaction[]> {
    try {
      await this.apiCall<Transaction[]>(this.TRANSACTIONS_ENDPOINTS.transactions, {
        method: 'GET'
      });
      
      // Return dummy data dengan perubahan dinamis
      return [...this.mockTransactions]
        .sort((a, b) => b.sale_date.getTime() - a.sale_date.getTime())
        .slice(0, 7 + Math.floor(Math.random() * 3));
    } catch (error) {
      console.warn('Get transactions API call failed, using fallback:', error);
      return this.mockTransactions.sort((a, b) => b.sale_date.getTime() - a.sale_date.getTime());
    }
  }

  /**
   * Get single transaction
   */
  async getTransaction(id: string): Promise<Transaction | null> {
    try {
      await this.apiCall<Transaction>(`${this.TRANSACTIONS_ENDPOINTS.transactions}/${id}`, {
        method: 'GET'
      });
      
      // Return dummy data
      const transaction = this.mockTransactions.find(t => t.id === id);
      return transaction || this.mockTransactions[0];
    } catch (error) {
      console.warn('Get transaction API call failed, using fallback:', error);
      return this.mockTransactions[0];
    }
  }

  /**
   * Create transaction
   */
  async createTransaction(request: CreateTransactionRequest): Promise<Transaction> {
    try {
      await this.apiCall<Transaction>(this.TRANSACTIONS_ENDPOINTS.transactions, {
        method: 'POST',
        body: JSON.stringify(request)
      });
      
      // Buat transaksi baru dari request
      const newTransaction: Transaction = {
        id: `TRX-${Date.now()}`,
        item_name: request.item_name,
        quantity: request.quantity,
        unit_price: request.unit_price,
        subtotal: request.quantity * request.unit_price,
        sale_date: new Date(request.sale_date),
        created_at: new Date(),
        customer: request.customer || { 
          name: ['Ahmad', 'Budi', 'Cindy', 'Diana'][Math.floor(Math.random() * 4)],
          phone: `+628${Math.floor(Math.random() * 9000000000) + 1000000000}`
        }
      };
      
      // Tambahkan ke array untuk demo (opsional)
      this.mockTransactions.unshift(newTransaction);
      
      return newTransaction;
    } catch (error) {
      console.warn('Create transaction API call failed, using fallback:', error);
      return {
        id: `TRX-${Date.now()}`,
        item_name: request.item_name,
        quantity: request.quantity,
        unit_price: request.unit_price,
        subtotal: request.quantity * request.unit_price,
        sale_date: new Date(request.sale_date),
        created_at: new Date(),
        customer: request.customer || { 
          name: 'Demo Customer',
          phone: '+6280000000000'
        }
      };
    }
  }

  /**
   * Update transaction
   */
  async updateTransaction(id: string, request: Partial<CreateTransactionRequest>): Promise<Transaction> {
    try {
      await this.apiCall<Transaction>(`${this.TRANSACTIONS_ENDPOINTS.transactions}/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(request)
      });
      
      // Cari dan update transaksi dalam array 
      const transactionIndex = this.mockTransactions.findIndex(t => t.id === id);
      if (transactionIndex !== -1) {
        this.mockTransactions[transactionIndex] = {
          ...this.mockTransactions[transactionIndex],
          ...request,
          subtotal: (request.quantity || this.mockTransactions[transactionIndex].quantity) * 
                   (request.unit_price || this.mockTransactions[transactionIndex].unit_price)
        };
        return this.mockTransactions[transactionIndex];
      }
      
      // Create fallback if not found
      const transaction = await this.getTransaction(id);
      if (!transaction) {
        throw new Error('Transaction not found');
      }
      return {
        ...transaction,
        ...request,
        item_name: request.item_name || transaction.item_name,
        quantity: request.quantity || transaction.quantity,
        unit_price: request.unit_price || transaction.unit_price,
        subtotal: (request.quantity || transaction.quantity) * (request.unit_price || transaction.unit_price)
      };
    } catch (error) {
      console.warn('Update transaction API call failed, using fallback:', error);
      const transaction = await this.getTransaction(id);
      if (!transaction) {
        throw new Error('Transaction not found');
      }
      return {
        ...transaction,
        ...request,
        item_name: request.item_name || transaction.item_name,
        quantity: request.quantity || transaction.quantity,
        unit_price: request.unit_price || transaction.unit_price,
        subtotal: (request.quantity || transaction.quantity) * (request.unit_price || transaction.unit_price)
      };
    }
  }

  /**
   * Delete transaction
   */
  async deleteTransaction(id: string): Promise<boolean> {
    try {
      const response = await this.apiCall<{ success: boolean }>(`${this.TRANSACTIONS_ENDPOINTS.transactions}/${id}`, {
        method: 'DELETE'
      });
      return response.success;
    } catch (error) {
      console.warn('Delete transaction API call failed, using fallback:', error);
      
      // Remove from array untuk demo
      const initialLength = this.mockTransactions.length;
      this.mockTransactions = this.mockTransactions.filter(t => t.id !== id);
      return initialLength !== this.mockTransactions.length;
    }
  }
}

export const transactionsService = new TransactionsService();