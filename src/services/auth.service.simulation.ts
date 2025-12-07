import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  User
} from '@/types/auth.types';
import { AUTH_CONSTANTS } from '@/constants/app.constants';

/**
 * Auth Service Simulasi - Semua data dummy untuk demo
 */
class AuthService {
  private readonly AUTH_TOKEN_KEY = AUTH_CONSTANTS.TOKEN_KEY;
  private readonly REFRESH_TOKEN_KEY = AUTH_CONSTANTS.REFRESH_TOKEN_KEY;
  private readonly TOKEN_EXPIRY_KEY = AUTH_CONSTANTS.TOKEN_EXPIRY_KEY;
  
  private readonly API_BASE_URL = 'http://localhost:3001';
  private readonly AUTH_ENDPOINTS = {
    login: '/auth/login',
    register: '/auth/register',
    profile: '/auth/profile',
    refresh: '/auth/refresh',
    logout: '/auth/logout'
  } as const;
  
  /**
   * Token management simulasi
   */
  private getToken(): string | null {
    try {
      const token = localStorage.getItem(this.AUTH_TOKEN_KEY);
      const expiry = localStorage.getItem(this.TOKEN_EXPIRY_KEY);
      
      if (!token) return null;
      
      // Check token expiry
      if (expiry) {
        const expiryDate = new Date(expiry);
        if (isNaN(expiryDate.getTime()) || expiryDate < new Date()) {
          this.clearAuthToken();
          return null;
        }
      }
      
      return token;
    } catch (error) {
      console.warn('Failed to get auth token from localStorage:', error);
      return null;
    }
  }
  
  private setAuthToken(token: string, expiry?: Date): void {
    try {
      localStorage.setItem(this.AUTH_TOKEN_KEY, token);
      if (expiry) {
        localStorage.setItem(this.TOKEN_EXPIRY_KEY, expiry.toISOString());
      }
    } catch (error) {
      console.warn('Failed to set auth token to localStorage:', error);
    }
  }
  
  private clearAuthToken(): void {
    try {
      localStorage.removeItem(this.AUTH_TOKEN_KEY);
      localStorage.removeItem(this.TOKEN_EXPIRY_KEY);
      localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    } catch (error) {
      console.warn('Failed to clear auth token from localStorage:', error);
    }
  }
  
  /**
   * Enhanced API call implementation
   */
  private async apiCall<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    // Simulasi delay untuk realisme
    await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 500));
    
    const url = `${this.API_BASE_URL}${endpoint}`;
    const token = this.getToken();
    
    // Simulate network errors occasionally
    if (Math.random() < 0.05) {
      throw new Error('Network connection failed');
    }
    
    return this.simulateResponse(endpoint, options) as T;
  }
  
  /**
   * Simulate backend responses
   */
  private simulateResponse(endpoint: string, _options: RequestInit): any {
    switch (endpoint) {
      case this.AUTH_ENDPOINTS.login:
        return {
          success: true,
          token: 'simulated-jwt-token-' + Date.now(),
          user: {
            id: 'user-001',
            email: 'demo@lakuin.com',
            name: 'Demo User',
            phone: '+6281234567890'
          },
          message: 'Login berhasil'
        };
        
      case this.AUTH_ENDPOINTS.register:
        return {
          success: true,
          message: 'Registrasi berhasil',
          user: {
            id: 'user-' + Date.now(),
            email: 'newuser@lakuin.com',
            name: 'New User',
            phone: '+6289876543210'
          }
        };
        
      case this.AUTH_ENDPOINTS.profile:
        return {
          id: 'user-001',
          email: 'demo@lakuin.com',
          name: 'Demo User',
          phone: '+6281234567890',
          role: 'owner',
          createdAt: new Date('2024-01-01')
        };
        
      case this.AUTH_ENDPOINTS.refresh:
        return {
          token: 'refreshed-token-' + Date.now(),
          expiresIn: '24h'
        };
        
      default:
        throw new Error('Unknown endpoint: ' + endpoint);
    }
  }
  
  /**
   * Comprehensive error handling
   */
  private handleError(error: unknown): never {
    console.error('Auth Service Error:', error);
    
    if (error instanceof Error) {
      const errorMessage = error.message.toLowerCase();
      
      if (errorMessage.includes('unauthorized') || errorMessage.includes('unauthenticated')) {
        throw new Error('Sesi login telah berakhir. Silakan login kembali.');
      }
      
      if (errorMessage.includes('invalid credentials')) {
        throw new Error('Email atau password salah. Periksa kembali dan coba lagi.');
      }
      
      if (errorMessage.includes('user not found') || errorMessage.includes('user not exist')) {
        throw new Error('Akun dengan email ini tidak ditemukan.');
      }
      
      if (errorMessage.includes('account locked') || errorMessage.includes('account suspended')) {
        throw new Error('Akun Anda terkunci. Hubungi administrator untuk bantuan.');
      }
      
      if (errorMessage.includes('network') || errorMessage.includes('net::')) {
        throw new Error('Terjadi masalah jaringan. Periksa koneksi internet Anda.');
      }
      
      if (errorMessage.includes('timeout')) {
        throw new Error('Permintaan timeout. Silakan coba lagi.');
      }
    }
    
    throw new Error('Terjadi kesalahan pada sistem autentikasi.');
  }
  
  /**
   * Check authentication status
   */
  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token;
  }
  
  /**
   * Login user with comprehensive validation and security enhancements
   */
  async login(request: LoginRequest): Promise<LoginResponse> {
    try {
      // Enhanced input validation
      if (!request.email || !request.password) {
        throw new Error('Email dan password wajib diisi');
      }
      
      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(request.email)) {
        throw new Error('Format email tidak valid');
      }
      
      // Password length validation
      if (request.password.length < AUTH_CONSTANTS.PASSWORD_MIN_LENGTH) {
        throw new Error(`Password minimal ${AUTH_CONSTANTS.PASSWORD_MIN_LENGTH} karakter`);
      }
      
      const data = await this.apiCall<LoginResponse>(this.AUTH_ENDPOINTS.login, {
        method: 'POST',
        body: JSON.stringify(request)
      });
      
      if (data.success && data.token) {
        // Set token with expiry (24 hours from now)
        const expiry = new Date(Date.now() + 24 * 60 * 60 * 1000);
        this.setAuthToken(data.token, expiry);
      }
      
      return data;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Register new user with comprehensive validation
   */
  async register(request: RegisterRequest): Promise<RegisterResponse> {
    try {
      // Enhanced input validation
      if (!request.name || !request.email || !request.password) {
        throw new Error('Nama, email dan password wajib diisi');
      }
      
      // Name validation
      if (request.name.trim().length < 2) {
        throw new Error('Nama minimal 2 karakter');
      }
      
      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(request.email)) {
        throw new Error('Format email tidak valid');
      }
      
      // Password length validation
      if (request.password.length < AUTH_CONSTANTS.PASSWORD_MIN_LENGTH) {
        throw new Error(`Password minimal ${AUTH_CONSTANTS.PASSWORD_MIN_LENGTH} karakter`);
      }
      
      // Password complexity validation
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
      if (!passwordRegex.test(request.password)) {
        throw new Error('Password harus mengandung huruf besar, huruf kecil, dan angka');
      }
      
      const data = await this.apiCall<RegisterResponse>(this.AUTH_ENDPOINTS.register, {
        method: 'POST',
        body: JSON.stringify(request)
      });
      
      if (data.success && data.token) {
        // Set token with expiry (24 hours from now)
        const expiry = new Date(Date.now() + 24 * 60 * 60 * 1000);
        this.setAuthToken(data.token, expiry);
      }
      
      return data;
    } catch (error) {
      this.handleError(error);
    }
  }
  
  /**
   * Get user profile
   */
  async getProfile(): Promise<User> {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('User tidak terautentikasi');
      }
      
      const data = await this.apiCall<User>(this.AUTH_ENDPOINTS.profile, {
        method: 'GET'
      });
      
      return data;
    } catch (error) {
      this.handleError(error);
    }
  }
  
  /**
   * Refresh token
   */
  async refreshToken(): Promise<{ token: string; expiresIn: string }> {
    try {
      const data = await this.apiCall<{ token: string; expiresIn: string }>(this.AUTH_ENDPOINTS.refresh, {
        method: 'POST'
      });
      
      if (data.token) {
        // Set token with expiry (24 hours from now)
        const expiry = new Date(Date.now() + 24 * 60 * 60 * 1000);
        this.setAuthToken(data.token, expiry);
      }
      
      return data;
    } catch (error) {
      this.handleError(error);
    }
  }
  
  /**
   * Logout user (enhanced security)
   */
  async logout(): Promise<void> {
    try {
      if (!this.isAuthenticated()) {
        return; // No need to log out if not authenticated
      }
      
      await this.apiCall(this.AUTH_ENDPOINTS.logout, {
        method: 'POST'
      });
    } catch (error) {
      console.warn('Logout API call failed:', error);
    } finally {
      // Always clear token regardless of API response
      this.clearAuthToken();
    }
  }
}

export const authService = new AuthService();