import type { Transaction } from "@/types/financial.types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Loader2 } from "lucide-react";
import { formatCurrency } from "@/helper/formatCurrency";
import { formatDate } from "@/helper/formatDate";

const TransactionTable = ({ transactions, isLoading = false }: { transactions: Transaction[]; isLoading?: boolean }) => {
  const getStatusBadge = (status: string) => {
    const variants: Record<string, { label: string; className: string }> = {
      completed: { label: 'Selesai', className: 'bg-green-100 text-green-800' },
      pending: { label: 'Pending', className: 'bg-yellow-100 text-yellow-800' },
      cancelled: { label: 'Dibatalkan', className: 'bg-red-100 text-red-800' }
    };
    const config = variants[status] || variants.completed;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const getTypeBadge = (type: string) => {
    return type === 'income' ? (
      <Badge className="bg-blue-100 text-blue-800">Pemasukan</Badge>
    ) : (
      <Badge className="bg-orange-100 text-orange-800">Pengeluaran</Badge>
    );
  };

  if (transactions.length === 0 && !isLoading) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <FileText className="w-12 h-12 text-zinc-400 mb-4" />
          <p className="text-zinc-600 text-center">
            Tidak ada transaksi ditemukan
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0 relative">
        {isLoading && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center z-10 rounded-lg">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              <p className="text-sm text-zinc-600">Memperbarui data...</p>
            </div>
          </div>
        )}
        <div className="overflow-x-auto bg-white">
          <div className="min-w-full sm:min-w-[768px]">
            <table className="w-full">
              <thead className="bg-zinc-50 border-b">
                <tr>
                  <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-zinc-500 uppercase">ID</th>
                  <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-zinc-500 uppercase">Tanggal</th>
                  <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-zinc-500 uppercase">Deskripsi</th>
                  <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-zinc-500 uppercase">Kategori</th>
                  <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-zinc-500 uppercase">Tipe</th>
                  <th className="px-3 sm:px-4 py-2 sm:py-3 text-right text-xs font-medium text-zinc-500 uppercase">Jumlah</th>
                  <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-zinc-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {transactions.slice(0, 20).map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-zinc-50">
                    <td className="px-3 sm:px-4 py-2 sm:py-3 text-sm font-medium text-zinc-900">{transaction.id}</td>
                    <td className="px-3 sm:px-4 py-2 sm:py-3 text-sm text-zinc-600">{formatDate(transaction.date)}</td>
                    <td className="px-3 sm:px-4 py-2 sm:py-3 text-sm text-zinc-900 max-w-[200px] truncate">{transaction.description}</td>
                    <td className="px-3 sm:px-4 py-2 sm:py-3 text-sm text-zinc-600">{transaction.category}</td>
                    <td className="px-3 sm:px-4 py-2 sm:py-3 text-sm">{getTypeBadge(transaction.type)}</td>
                    <td className="px-3 sm:px-4 py-2 sm:py-3 text-sm text-right font-semibold">
                      <span className={transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}>
                        {transaction.type === 'income' ? '+' : '-'}
                        {formatCurrency(transaction.amount)}
                      </span>
                    </td>
                    <td className="px-3 sm:px-4 py-2 sm:py-3 text-sm">{getStatusBadge(transaction.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {transactions.length === 0 && !isLoading && (
            <div className="text-center py-8 text-sm text-zinc-500">
              Tidak ada data tersedia
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionTable