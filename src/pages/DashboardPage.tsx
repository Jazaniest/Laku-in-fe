import { useDashboard } from '@/hooks/useDashboard';
import StatsCard from '@/components/dashboard/StatsCard';
import DashboardNavbar from '@/components/dashboard/DashboardNavbar';
import LoadingDashboard from '@/components/dashboard/LoadingDashboard';
import ErrorDashboard from '@/components/dashboard/ErrorDashboard';
import FeatureCard from '@/components/dashboard/FeatureCard';
import QuickActionCard from '@/components/dashboard/QuickActionCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import VoiceChat from '@/components/VoiceChat';

const DashboardPage = () => {
  const { data, loading, error, refreshData } = useDashboard();

  // Loading state
  if (loading) {
    return <LoadingDashboard />;
  }

  // Error state
  if (error) {
    return <ErrorDashboard message={error} onRetry={refreshData} />;
  }

  // No data state
  if (!data) {
    return <ErrorDashboard message="Data tidak tersedia" onRetry={refreshData} />;
  }

  const { user, stats, features, quickActions } = data;

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Navbar */}
      <DashboardNavbar userName={user.fullName} />

      {/* Main Content */}
      <main className="py-4 sm:py-6 md:p-6 px-4 sm:px-4 md:px-6 max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-zinc-900 mb-1 sm:mb-2">
            Selamat Datang, {user.fullName.split(' ')[0]}! 👋
          </h1>
          <p className="text-zinc-600 text-sm sm:text-base">
            Berikut ringkasan bisnis Anda hari ini
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">
          <StatsCard
            title="Total Pendapatan"
            value={stats.totalRevenue.formatted}
            description={stats.totalRevenue.description}
            trend={stats.totalRevenue.trend}
          />
          <StatsCard
            title="Total Transaksi"
            value={stats.totalTransactions.formatted}
            description={stats.totalTransactions.description}
            trend={stats.totalTransactions.trend}
          />
          <StatsCard
            title="Produk Terjual"
            value={stats.productsSold.formatted}
            description={stats.productsSold.description}
            trend={stats.productsSold.trend}
          />
          <StatsCard
            title="Customer Aktif"
            value={stats.activeCustomers.formatted}
            description={stats.activeCustomers.description}
            trend={stats.activeCustomers.trend}
          />
        </div>

        {/* Features Section */}
        <div className="mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-zinc-900 mb-1 sm:mb-2">
            Fitur Utama
          </h2>
          <p className="text-zinc-600 mb-4 sm:mb-6 text-sm sm:text-base">
            Pilih fitur yang ingin Anda gunakan
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {features.map((feature) => (
            <FeatureCard key={feature.id} feature={feature} />
          ))}
        </div>

        {/* Quick Actions Section */}
        <div className="mt-12">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Aksi cepat untuk efisiensi kerja Anda</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {quickActions.map((action) => (
                  <QuickActionCard key={action.id} action={action} />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        <VoiceChat />
      </main>
    </div>
  );
};

export default DashboardPage;