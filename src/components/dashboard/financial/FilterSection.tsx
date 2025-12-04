import { useState } from 'react';
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
import type { FilterSectionProps } from '@/types/financial.types';

const FilterSection = ({
  filters,
  onFilterChange,
  onReset
}: FilterSectionProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Filter className="w-4 h-4 mr-2" />
          Filter
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
            <Label>Tipe Transaksi</Label>
            <Select
              value={filters.type || 'all'}
              onValueChange={(value: 'all' | 'income' | 'expense') => onFilterChange({ type: value })}
            >
              <SelectTrigger>
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
            <Label>Status</Label>
            <Select
              value={filters.status || 'all'}
              onValueChange={(value: 'all' | 'completed' | 'pending' | 'cancelled') => onFilterChange({ status: value })}
            >
              <SelectTrigger>
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

          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={onReset}>
              Reset
            </Button>
            <Button className="flex-1" onClick={() => setIsOpen(false)}>
              Terapkan
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FilterSection