import { useState, useEffect } from 'react';
import { Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { financialService } from '@/services/financial.service';
import type { FilterSectionProps } from '@/types/financial.types';

const FilterSection = ({
  filters,
  onFilterChange,
  onReset
}: FilterSectionProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const cats = await financialService.getCategories();
        setCategories(cats);
      } catch (err) {
        console.error('Error fetching categories:', err);
      } finally {
        setLoadingCategories(false);
      }
    };

    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  const hasActiveFilters =
    (filters.type && filters.type !== 'all') ||
    filters.category ||
    (filters.status && filters.status !== 'all') ||
    filters.paymentMethod;

  const handleReset = () => {
    onReset();
    setIsOpen(false);
  };

  const handleApply = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant={hasActiveFilters ? "default" : "outline"}
          className={hasActiveFilters ? "bg-blue-600" : ""}
        >
          <Filter className="w-4 h-4 mr-2" />
          Filter {hasActiveFilters && <span className="ml-1 text-xs">●</span>}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Filter Transaksi</DialogTitle>
          <DialogDescription>
            Saring transaksi berdasarkan kriteria tertentu
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="filter-type">Tipe Transaksi</Label>
            <Select
              value={filters.type || 'all'}
              onValueChange={(value: 'all' | 'income' | 'expense') =>
                onFilterChange({ type: value })
              }
            >
              <SelectTrigger id="filter-type">
                <SelectValue placeholder="Pilih tipe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua</SelectItem>
                <SelectItem value="income">Pemasukan</SelectItem>
                <SelectItem value="expense">Pengeluaran</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="filter-category">Kategori</Label>
            <Select
              value={filters.category || 'all'}
              onValueChange={(value) =>
                onFilterChange({ category: value === 'all' ? undefined : value })
              }
              disabled={loadingCategories}
            >
              <SelectTrigger id="filter-category">
                <SelectValue placeholder={loadingCategories ? "Memuat..." : "Pilih kategori"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kategori</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="filter-status">Status</Label>
            <Select
              value={filters.status || 'all'}
              onValueChange={(value: 'all' | 'completed' | 'pending' | 'cancelled') =>
                onFilterChange({ status: value })
              }
            >
              <SelectTrigger id="filter-status">
                <SelectValue placeholder="Pilih status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua</SelectItem>
                <SelectItem value="completed">Selesai</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="cancelled">Dibatalkan</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="filter-method">Metode Pembayaran</Label>
            <Select
              value={filters.paymentMethod || 'all'}
              onValueChange={(value) =>
                onFilterChange({ paymentMethod: value === 'all' ? undefined : value })
              }
            >
              <SelectTrigger id="filter-method">
                <SelectValue placeholder="Pilih metode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Metode</SelectItem>
                <SelectItem value="cash">Tunai</SelectItem>
                <SelectItem value="transfer">Transfer Bank</SelectItem>
                <SelectItem value="card">Kartu Kredit/Debit</SelectItem>
                <SelectItem value="e-wallet">E-Wallet</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleReset}
            >
              Reset
            </Button>
            <Button className="flex-1" onClick={handleApply}>
              Terapkan
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FilterSection;