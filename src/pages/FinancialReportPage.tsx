import { useFinancialReport } from '@/hooks/useFinancialReport';
import { useState } from 'react';
import PageHeader from '@/components/dashboard/financial/PageHeader'
import LoadingState from '@/components/dashboard/financial/LoadingState';
import ErrorState from '@/components/dashboard/financial/ErrorState';
import SummaryCard from '@/components/dashboard/financial/SummaryCard';
import FilterSection from '@/components/dashboard/financial/FilterSection';
import SearchSection from '@/components/dashboard/financial/SearchSection';
import TransactionTable from '@/components/dashboard/financial/TransactionTable';
import { formatCurrency } from '@/helper/formatCurrency';
import { TrendingUp, TrendingDown, DollarSign, Receipt, Loader2, Download, RotateCcw } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button';

const FinancialReportPage = () => {
  const {
    data,
    loading,
    tableLoading,
    error,
    filters,
    updateFilters,
    resetFilters,
    refreshReport,
    exportReport
  } = useFinancialReport();

  const [exportLoading, setExportLoading] = useState(false);

  const handleBack = () => {
    window.location.href = '/dashboard';
  };

  const handleSearch = (value: string) => {
    updateFilters({ search: value });
  };

  const handleClearSearch = () => {
    updateFilters({ search: '' });
  };

  const handleExport = async (format: 'pdf' | 'excel') => {
    try {
      setExportLoading(true);
      const filename = await exportReport(format);
      alert(`Laporan berhasil di-export: ${filename}`);
    } catch (err) {
      alert('Gagal export laporan, ' + (err instanceof Error ? err.message : 'Silakan coba lagi'));
    } finally {
      setExportLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      <PageHeader onBack={handleBack} />

      <main className="py-4 sm:py-6 md:p-6 px-4 sm:px-4 md:px-6 max-w-7xl mx-auto">
        {loading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState message={error} onRetry={refreshReport} />
        ) : data ? (
          <div className="space-y-6">
            {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              <SummaryCard
                title="Total Pemasukan"
                value={formatCurrency(data.summary.totalIncome)}
                icon={TrendingUp}
                color="bg-green-500"
                isLoading={tableLoading}
              />
              <SummaryCard
                title="Total Pengeluaran"
                value={formatCurrency(data.summary.totalExpense)}
                icon={TrendingDown}
                color="bg-red-500"
                isLoading={tableLoading}
              />
              <SummaryCard
                title="Profit Bersih"
                value={formatCurrency(data.summary.netProfit)}
                trend={data.summary.profitMargin}
                icon={DollarSign}
                color="bg-blue-500"
                isLoading={tableLoading}
              />
              <SummaryCard
                title="Total Transaksi"
                value={data.summary.transactionCount.toString()}
                icon={Receipt}
                color="bg-purple-500"
                isLoading={tableLoading}
              />
            </div>

            {/* Chart Section */}
            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-6">
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
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Daftar Transaksi</CardTitle>
                      <CardDescription>
                        Menampilkan {data.transactions.length} transaksi
                        {Object.keys(filters).length > 0 && ' (dengan filter aktif)'}
                      </CardDescription>
                    </div>
                  </div>

                  <div className="flex flex-col xs:flex-row items-start xs:items-center gap-2 sm:gap-3 flex-wrap">
                    <SearchSection
                      value={filters.search || ''}
                      onChange={handleSearch}
                      onClear={handleClearSearch}
                      placeholder="Cari ID, deskripsi, kategori..."
                    />
                    <FilterSection
                      filters={filters}
                      onFilterChange={(newFilters) => updateFilters(newFilters)}
                      onReset={resetFilters}
                    />
                    <div className="flex items-center gap-2 flex-wrap">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={refreshReport}
                        title="Refresh data"
                        disabled={tableLoading}
                      >
                        <RotateCcw className={`w-4 h-4 ${tableLoading ? 'animate-spin' : ''}`} />
                      </Button>
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
                </div>
              </CardHeader>
            </Card>

            <TransactionTable transactions={data.transactions} isLoading={tableLoading} />
          </div>
        ) : null}
      </main>
    </div>
  );
};

export default FinancialReportPage;