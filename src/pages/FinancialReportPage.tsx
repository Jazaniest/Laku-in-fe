import { useFinancialReport } from '@/hooks/useFinancialReport';
import { useState } from 'react';
import PageHeader from '@/components/dashboard/financial/PageHeader'
import LoadingState from '@/components/dashboard/financial/LoadingState';
import ErrorState from '@/components/dashboard/financial/ErrorState';
import SummaryCard from '@/components/dashboard/financial/SummaryCard';
import FilterSection from '@/components/dashboard/financial/FilterSection';
import TransactionTable from '@/components/dashboard/financial/TransactionTable';
import { formatCurrency } from '@/helper/formatCurrency';
import { TrendingUp, TrendingDown, DollarSign, Receipt, Search, Loader2, Download } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const FinancialReportPage = () => {
  const {
    data,
    loading,
    error,
    filters,
    updateFilters,
    resetFilters,
    refreshReport,
    exportReport
  } = useFinancialReport();

  const [searchQuery, setSearchQuery] = useState('');
  const [exportLoading, setExportLoading] = useState(false);

  const handleBack = () => {
    window.location.href = '/dashboard';
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    updateFilters({ search: value });
  };

  const handleExport = async (format: 'pdf' | 'excel') => {
    try {
      setExportLoading(true);
      const filename = await exportReport(format);
      alert(`Laporan berhasil di-export: ${filename}`);
    } catch (err) {
      alert('Gagal export laporan, ' + err);
    } finally {
      setExportLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      <PageHeader onBack={handleBack} />

      <main className="p-6 max-w-7xl mx-auto">
        {loading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState message={error} onRetry={refreshReport} />
        ) : data ? (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <SummaryCard
                title="Total Pemasukan"
                value={formatCurrency(data.summary.totalIncome)}
                icon={TrendingUp}
                color="bg-green-500"
              />
              <SummaryCard
                title="Total Pengeluaran"
                value={formatCurrency(data.summary.totalExpense)}
                icon={TrendingDown}
                color="bg-red-500"
              />
              <SummaryCard
                title="Profit Bersih"
                value={formatCurrency(data.summary.netProfit)}
                trend={data.summary.profitMargin}
                icon={DollarSign}
                color="bg-blue-500"
              />
              <SummaryCard
                title="Total Transaksi"
                value={data.summary.transactionCount.toString()}
                icon={Receipt}
                color="bg-purple-500"
              />
            </div>

            {/* Chart Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Breakdown Kategori</CardTitle>
                  <CardDescription>Pengeluaran berdasarkan kategori</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {data.categoryBreakdown.slice(0, 5).map((cat) => (
                      <div key={cat.category}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">{cat.category}</span>
                          <span className="text-sm text-zinc-600">
                            {formatCurrency(cat.amount)} ({cat.percentage.toFixed(1)}%)
                          </span>
                        </div>
                        <div className="w-full bg-zinc-200 rounded-full h-2">
                          <div
                            className="h-2 rounded-full transition-all"
                            style={{
                              width: `${cat.percentage}%`,
                              backgroundColor: cat.color
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Metode Pembayaran</CardTitle>
                  <CardDescription>Distribusi metode pembayaran</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {data.paymentMethods.map((method) => (
                      <div key={method.method} className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-medium">{method.method}</p>
                          <p className="text-sm text-zinc-600">{method.count} transaksi</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{formatCurrency(method.amount)}</p>
                          <p className="text-sm text-zinc-600">{method.percentage.toFixed(1)}%</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Transactions Section */}
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle>Daftar Transaksi</CardTitle>
                    <CardDescription>
                      Menampilkan {data.transactions.length} transaksi
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
                      <Input
                        placeholder="Cari transaksi..."
                        className="pl-10 w-64"
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                      />
                    </div>
                    <FilterSection
                        filters={filters}
                        onFilterChange={(newFilters) => updateFilters(newFilters)}
                        onReset={resetFilters}
                    />
                    <Button
                      variant="outline"
                      onClick={() => handleExport('excel')}
                      disabled={exportLoading}
                    >
                      {exportLoading ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Download className="w-4 h-4 mr-2" />
                      )}
                      Export
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <TransactionTable transactions={data.transactions} />
          </div>
        ) : null}
      </main>
    </div>
  );
};

export default FinancialReportPage;