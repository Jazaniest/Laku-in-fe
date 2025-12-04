import type { DashboardData, User, Stats, Feature, QuickAction, Notification } from '@/types/dashboard.types';

class DashboardService {
  // Simulate API delay
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Get current user data
  async getCurrentUser(): Promise<User> {
    await this.delay(300);
    
    return {
      id: 'USR-001',
      fullName: 'John Doe',
      email: 'john.doe@lakuin.com',
      phone: '081234567890',
      avatar: '',
      role: 'owner',
      createdAt: new Date('2024-01-15')
    };
  }

  // Get dashboard statistics
  async getStats(): Promise<Stats> {
    await this.delay(500);
    
    return {
      totalRevenue: {
        value: 45200000,
        formatted: 'Rp 45.2M',
        trend: 12.5,
        description: 'dari bulan lalu'
      },
      totalTransactions: {
        value: 1234,
        formatted: '1,234',
        trend: 8.2,
        description: 'dari bulan lalu'
      },
      productsSold: {
        value: 3456,
        formatted: '3,456',
        trend: -2.4,
        description: 'dari bulan lalu'
      },
      activeCustomers: {
        value: 892,
        formatted: '892',
        trend: 15.3,
        description: 'dari bulan lalu'
      }
    };
  }

  // Get available features
  async getFeatures(): Promise<Feature[]> {
    await this.delay(300);
    
    return [
      {
        id: 'FTR-001',
        icon: 'FileText',
        title: 'Laporan Keuangan',
        description: 'Lihat dan kelola laporan keuangan bisnis Anda dengan detail lengkap',
        color: 'bg-blue-500',
        path: '/dashboard/financial-report',
        isActive: true
      },
      {
        id: 'FTR-002',
        icon: 'TrendingUp',
        title: 'Analisis Bisnis',
        description: 'Dapatkan insight dan analisis mendalam tentang performa bisnis',
        color: 'bg-green-500',
        path: '/dashboard/business-analytics',
        isActive: true
      },
      {
        id: 'FTR-003',
        icon: 'Upload',
        title: 'Upload Foto Nota',
        description: 'Upload foto nota untuk otomatis masuk ke laporan keuangan',
        color: 'bg-purple-500',
        path: '/dashboard/receipt-upload',
        isActive: true
      },
      {
        id: 'FTR-004',
        icon: 'Wand2',
        title: 'AI Poster Generator',
        description: 'Buat poster promosi menarik dengan teknologi AI generatif',
        color: 'bg-orange-500',
        path: '/dashboard/poster-generator',
        isActive: true
      }
    ];
  }

  // Get quick actions
  async getQuickActions(): Promise<QuickAction[]> {
    await this.delay(200);
    
    return [
      {
        id: 'QA-001',
        icon: 'FileText',
        title: 'Buat Laporan Baru',
        description: 'Tambah laporan keuangan',
        color: 'bg-blue-100',
        action: 'create-report'
      },
      {
        id: 'QA-002',
        icon: 'Upload',
        title: 'Upload Nota',
        description: 'Scan nota belanja',
        color: 'bg-purple-100',
        action: 'upload-receipt'
      },
      {
        id: 'QA-003',
        icon: 'Wand2',
        title: 'Generate Poster',
        description: 'Buat poster AI',
        color: 'bg-orange-100',
        action: 'generate-poster'
      }
    ];
  }

  // Get notifications
  async getNotifications(): Promise<Notification[]> {
    await this.delay(400);
    
    return [
      {
        id: 'NOT-001',
        title: 'Laporan Bulanan Siap',
        message: 'Laporan keuangan bulan November telah selesai diproses',
        type: 'success',
        isRead: false,
        createdAt: new Date('2024-12-03T10:30:00')
      },
      {
        id: 'NOT-002',
        title: 'Pembayaran Tertunda',
        message: '5 transaksi menunggu konfirmasi pembayaran',
        type: 'warning',
        isRead: false,
        createdAt: new Date('2024-12-03T09:15:00')
      },
      {
        id: 'NOT-003',
        title: 'Stok Menipis',
        message: '12 produk memiliki stok dibawah 10 unit',
        type: 'warning',
        isRead: true,
        createdAt: new Date('2024-12-02T16:45:00')
      },
      {
        id: 'NOT-004',
        title: 'Target Penjualan Tercapai',
        message: 'Selamat! Target penjualan bulan ini telah tercapai 110%',
        type: 'success',
        isRead: true,
        createdAt: new Date('2024-12-01T14:20:00')
      },
      {
        id: 'NOT-005',
        title: 'Update Sistem',
        message: 'Sistem akan maintenance pada 5 Desember 2024',
        type: 'info',
        isRead: true,
        createdAt: new Date('2024-11-30T08:00:00')
      }
    ];
  }

  // Get all dashboard data
  async getDashboardData(): Promise<DashboardData> {
    const [user, stats, features, quickActions, notifications] = await Promise.all([
      this.getCurrentUser(),
      this.getStats(),
      this.getFeatures(),
      this.getQuickActions(),
      this.getNotifications()
    ]);

    return {
      user,
      stats,
      features,
      quickActions,
      notifications
    };
  }

  // Mark notification as read
  async markNotificationAsRead(notificationId: string): Promise<boolean> {
    await this.delay(200);
    console.log(`Notification ${notificationId} marked as read`);
    return true;
  }

  // Get unread notification count
  async getUnreadNotificationCount(): Promise<number> {
    const notifications = await this.getNotifications();
    return notifications.filter(n => !n.isRead).length;
  }

  // Update user profile
  async updateUserProfile(userId: string, data: Partial<User>): Promise<User> {
    await this.delay(500);
    console.log('Updating user profile:', userId, data);
    
    const currentUser = await this.getCurrentUser();
    return {
      ...currentUser,
      ...data
    };
  }
}

// Export singleton instance
export const dashboardService = new DashboardService();


// ==========================================
// FILE: src/hooks/useDashboard.ts
// ==========================================

