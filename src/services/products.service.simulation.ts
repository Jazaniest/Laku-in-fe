import type {
  Product,
  CreateProductRequest,
  UpdateProductRequest
} from '@/types/products.types';

/**
 * Products Service Simulasi - Semua data dummy untuk demo
 */
class ProductsService {
  private readonly API_BASE_URL = 'http://localhost:3001';
  private readonly PRODUCTS_ENDPOINTS = {
    products: '/products'
  } as const;

  // Data produk simulasi
  private mockProducts: Product[] = [
    {
      id: 1,
      name: 'Laptop Gaming MSI Stealth',
      stock: 25,
      price: 15000000,
      category: 'Elektronik',
      description: 'Laptop gaming tipis dan ringan dengan RTX 4060',
      status: 'active',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-15')
    },
    {
      id: 2,
      name: 'Monitor 24" Samsung Curved',
      stock: 40,
      price: 3000000,
      category: 'Elektronik',
      description: 'Monitor curved untuk pengalaman visual maksimal',
      status: 'active',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-10')
    },
    {
      id: 3,
      name: 'Keyboard Razer Mechanical',
      stock: 100,
      price: 1500000,
      category: 'Elektronik',
      description: 'Keyboard mekanik untuk game dan produktivitas',
      status: 'active',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-05')
    },
    {
      id: 4,
      name: 'Mouse Logitech Gaming',
      stock: 75,
      price: 1200000,
      category: 'Elektronik',
      description: 'Mouse gaming presisi tinggi',
      status: 'active',
      createdAt: new Date('2024-01-02'),
      updatedAt: new Date('2024-01-08')
    },
    {
      id: 5,
      name: 'iPhone 15 Pro Max',
      stock: 30,
      price: 25000000,
      category: 'Elektronik',
      description: 'Smartphone flagship iPhone terbaru',
      status: 'active',
      createdAt: new Date('2024-01-03'),
      updatedAt: new Date('2024-01-12')
    },
    {
      id: 6,
      name: 'Tas Kantor Premium',
      stock: 50,
      price: 850000,
      category: 'Fashion',
      description: 'Tas kerja elegan untuk professional',
      status: 'active',
      createdAt: new Date('2024-01-04'),
      updatedAt: new Date('2024-01-09')
    },
    {
      id: 7,
      name: 'Jaket Kulit',
      stock: 25,
      price: 2800000,
      category: 'Fashion',
      description: 'Jaket kulit premium berkualitas',
      status: 'active',
      createdAt: new Date('2024-01-05'),
      updatedAt: new Date('2024-01-11')
    },
    {
      id: 8,
      name: 'Kemeja Formal',
      stock: 80,
      price: 450000,
      category: 'Fashion',
      description: 'Kemeja formal untuk acara resmi',
      status: 'active',
      createdAt: new Date('2024-01-06'),
      updatedAt: new Date('2024-01-13')
    }
  ];

  /**
   * API call simulasi
   */
  private async apiCall<T>(_endpoint: string, _options: RequestInit = {}): Promise<T> {
    // Simulasi network delay
    await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 800));
    
    // Simulate network errors occasionally
    if (Math.random() < 0.05) {
      throw new Error('Connection timeout');
    }
    
    return {} as T;
  }

  /**
   * Simulate auth token (untuk demo)
   */
  private getAuthToken(): string {
    return localStorage.getItem('auth_token') || 'demo-token';
  }

  /**
   * Get all products
   */
  async getProducts(): Promise<Product[]> {
    try {
      await this.apiCall<Product[]>(this.PRODUCTS_ENDPOINTS.products, {
        method: 'GET'
      });
      
      // Return dummy data
      return this.mockProducts.sort((a, b) => a.id - b.id);
    } catch (error) {
      console.warn('API call failed, using fallback data:', error);
      return this.mockProducts;
    }
  }

  /**
   * Get single product
   */
  async getProduct(id: string): Promise<Product | null> {
    try {
      await this.apiCall<Product>(`${this.PRODUCTS_ENDPOINTS.products}/${id}`, {
        method: 'GET'
      });
      
      // Return dummy data
      const product = this.mockProducts.find(p => p.id === parseInt(id));
      return product || this.mockProducts[0];
    } catch (error) {
      console.warn('Get product API call failed, using fallback:', error);
      return this.mockProducts[0];
    }
  }

  /**
   * Create product
   */
  async createProduct(request: CreateProductRequest): Promise<Product> {
    try {
      await this.apiCall<Product>(this.PRODUCTS_ENDPOINTS.products, {
        method: 'POST',
        body: JSON.stringify(request)
      });
      
      // Buat produk baru dari request
      const newProduct: Product = {
        id: Math.max(...this.mockProducts.map(p => p.id)) + 1,
        name: request.name,
        stock: request.stock,
        price: request.price,
        category: request.category || 'Umum',
        description: request.description || '',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // Tambahkan ke array (untuk demo)
      this.mockProducts.push(newProduct);
      
      return newProduct;
    } catch (error) {
      console.warn('Create product API call failed, using fallback:', error);
      return {
        id: Math.max(...this.mockProducts.map(p => p.id)) + 1,
        name: request.name,
        stock: request.stock,
        price: request.price,
        category: request.category || 'Umum',
        description: request.description || '',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      };
    }
  }

  /**
   * Update product
   */
  async updateProduct(id: string, request: UpdateProductRequest): Promise<Product> {
    try {
      await this.apiCall<Product>(`${this.PRODUCTS_ENDPOINTS.products}/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(request)
      });
      
      // Cari dan update produk di array (untuk demo)
      const productIndex = this.mockProducts.findIndex(p => p.id === parseInt(id));
      if (productIndex !== -1) {
        this.mockProducts[productIndex] = {
          ...this.mockProducts[productIndex],
          ...request,
          updatedAt: new Date()
        };
        return this.mockProducts[productIndex];
      }
      
      // Return fallback jika id tidak ditemukan
      return {
        id: parseInt(id),
        name: request.name || 'Produk Demo',
        stock: request.stock || 50,
        price: request.price || 5000000,
        category: request.category || 'Umum',
        status: 'active',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date()
      };
    } catch (error) {
      console.warn('Update product API call failed, using fallback:', error);
      return {
        id: parseInt(id),
        name: request.name || 'Produk Demo',
        stock: request.stock || 50,
        price: request.price || 5000000,
        category: request.category || 'Umum',
        status: 'active',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date()
      };
    }
  }

  /**
   * Delete product
   */
  async deleteProduct(id: string): Promise<boolean> {
    try {
      const response = await this.apiCall<{ success: boolean }>(`${this.PRODUCTS_ENDPOINTS.products}/${id}`, {
        method: 'DELETE'
      });
      return response.success;
    } catch (error) {
      console.warn('Delete product API call failed, using fallback:', error);
      
      // Hapus dari array untuk demo
      const initialLength = this.mockProducts.length;
      this.mockProducts = this.mockProducts.filter(p => p.id !== parseInt(id));
      return initialLength !== this.mockProducts.length;
    }
  }

  /**
   * Upload stock data - versi simulasi (tidak terhubung ke API)
   */
  async uploadStockData(file: File): Promise<any> {
    try {
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulasi proses upload
      
      const fileContent = await this.readExcelFile(file);
      
      // Simulasi response
      return {
        updated: Math.floor(Math.random() * 20) + 1,
        added: Math.floor(Math.random() * 10) + 1,
        skipped: Math.floor(Math.random() * 5),
        fileName: file.name,
        summary: 'Upload stok berhasil dilakukan',
        processedItems: fileContent.map((row, index) => ({
          name: `Produk ${index + 1}`,
          barcode: `BR${String(index + 1).padStart(6, '0')}`,
          category: 'Elektronik',
          price: Math.floor(Math.random() * 5000000) + 50000,
          quantity: Math.floor(Math.random() * 100) + 1
        }))
      };
    } catch (error) {
      console.warn('Stock upload API call failed, using fallback:', error);
      return {
        updated: 5,
        added: 3,
        skipped: 2,
        fileName: file.name,
        summary: 'Upload stok berhasil (simulasi)',
        processedItems: [
          {
            name: 'Laptop Gaming',
            barcode: 'BR001001',
            category: 'Elektronik',
            price: 15000000,
            quantity: 25
         }
        ]
      };
    }
  }

  /**
   * Helper untuk membaca file Excel (simulasi)
   */
  private async readExcelFile(file: File): Promise<any[]> {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulasi membaca file
    
    // Return dummy data
    return Array.from({ length: 10 }, (_, i) => ({
      name: `Produk ${i + 1}`,
      barcode: `BR${String(i + 1).padStart(6, '0')}`,
      category: ['Elektronik', 'Fashion', 'Makanan'][i % 3],
      price: Math.floor(Math.random() * 5000000) + 50000,
      quantity: Math.floor(Math.random() * 100) + 1
    }));
  }
}

export const productsService = new ProductsService();