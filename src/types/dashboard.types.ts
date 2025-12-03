export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  avatar?: string;
  role: 'owner' | 'admin' | 'staff';
  createdAt: Date;
}

export interface Stats {
  totalRevenue: {
    value: number;
    formatted: string;
    trend: number;
    description: string;
  };
  totalTransactions: {
    value: number;
    formatted: string;
    trend: number;
    description: string;
  };
  productsSold: {
    value: number;
    formatted: string;
    trend: number;
    description: string;
  };
  activeCustomers: {
    value: number;
    formatted: string;
    trend: number;
    description: string;
  };
}

export interface Feature {
  id: string;
  icon: string;
  title: string;
  description: string;
  color: string;
  path: string;
  isActive: boolean;
}

export interface QuickAction {
  id: string;
  icon: string;
  title: string;
  description: string;
  color: string;
  action: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  isRead: boolean;
  createdAt: Date;
}

export interface DashboardData {
  user: User;
  stats: Stats;
  features: Feature[];
  quickActions: QuickAction[];
  notifications: Notification[];
}