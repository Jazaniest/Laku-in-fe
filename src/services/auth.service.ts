import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  AuthErrorResponse,
  User
} from '@/types/auth.types';
import { AUTH_CONSTANTS } from '@/constants/app.constants';

/**
 * Enhanced Auth Service with comprehensive error handling, security improvements, and better validation
 */
class AuthService {
  private readonly AUTH_TOKEN_KEY = AUTH_CONSTANTS.TOKEN_KEY;
  private readonly REFRESH_TOKEN_KEY = AUTH_CONSTANTS.REFRESH_TOKEN_KEY;
  private readonly TOKEN_EXPIRY_KEY = AUTH_CONSTANTS.TOKEN_EXPIRY_KEY;
  
  private readonly API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
  private readonly AUTH_ENDPOINTS = {
    login: '/auth/login',
    register: '/auth/register',
    profile: '/auth/profile',
    refresh: '/auth/refresh',
    logout: '/auth/logout'
  } as const;
  
  /**
   * Token management with enhanced security
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
    const url = `${this.API_BASE_URL}${endpoint}`;
    const token = this.getToken();
    
    // Enhanced request configuration with caching and other headers
    const enhancedOptions: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'X-Client-Version': '1.0.0',
        'Cache-Control': 'no-cache', // Prevent caching of auth requests
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...(options.headers || {})
      },
      credentials: 'include', // Include cookies for cross-origin requests
      mode: 'cors', // Enable CORS
      cache: 'no-store', // Prevent caching
    };
    
    try {
      const response = await fetch(url, enhancedOptions);
      
      // Response validation
      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        
        try {
          const errorData = await response.json() as AuthErrorResponse;
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch {
          const errorText = await response.text();
          if (errorText) errorMessage = errorText;
        }
        
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      return data as T;
    } catch (error) {
      if (error instanceof Error && error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error(`Gagal terhubung ke server: ${this.API_BASE_URL}. Periksa koneksi internet Anda.`);
      }
      
      if (error instanceof Error) {
        const networkError = error.message.includes('Failed to fetch') ||
                           error.message.includes('net::ERR_CONNECTION');
        if (networkError) {
          throw new Error('Gagal terhubung ke server autentikasi. Periksa koneksi internet Anda.');
        }
      }
      
      throw error;
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
        this.clearAuthToken();
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
      
      if (errorMessage.includes('internal server error') || errorMessage.includes('500')) {
        throw new Error('Terjadi kesalahan server. Silakan coba lagi nanti.');
      }
      
      if (errorMessage.includes('forbidden')) {
        throw new Error('Anda tidak memiliki izin untuk melakukan tindakan ini.');
      }
      
      throw error;
    }
    
    throw new Error('Terjadi kesalahan yang tidak diketahui saat memproses permintaan autentikasi.');
  }
  
  /**
   * Check if user is currently authenticated
   */
  isAuthenticated(): boolean {
    try {
      const token = this.getToken();
      return !!token && token.length > 0;
    } catch (error) {
      console.warn('Auth check failed:', error);
      return false;
    }
  }
  
  /**
   * Login with comprehensive validation and security
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
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      this.clearAuthToken();
      // Note: Logout endpoint call is optional here
      // Some apps prefer to just clear the token without calling logout endpoint
    } catch (error) {
      console.warn('Logout cleanup error:', error);
    }
  }
  
  /**
   * Refresh token if available
   */
  async refreshToken(): Promise<void> {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('User tidak terautentikasi');
      }
      
      const data = await this.apiCall<LoginResponse>(this.AUTH_ENDPOINTS.refresh, {
        method: 'POST'
      });
      
      if (data.token) {
        const expiry = new Date(Date.now() + 24 * 60 * 60 * 1000);
        this.setAuthToken(data.token, expiry);
      }
    } catch (error) {
      console.warn('Token refresh failed:', error);
      this.clearAuthToken();
      throw new Error('Token refresh gagal. Silakan login kembali.');
    }
  }
}

export const authService = new AuthService();