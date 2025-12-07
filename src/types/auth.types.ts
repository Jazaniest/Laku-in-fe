// Authentication types and interfaces

export interface User {
  id: string;
  email: string;
  name: string;
  role?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  user: User;
  token: string;
  message?: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface RegisterResponse {
  success: boolean;
  user: User;
  token: string;
  message?: string;
}

export interface AuthErrorResponse {
  success: boolean;
  error: string;
  message: string;
  statusCode?: number;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// API Configuration - adjust base URL as needed
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
export const AUTH_API_BASE = `${API_BASE_URL}/auth`;