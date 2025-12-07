import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const PageHeader = ({ onBack }: { onBack: () => void }) => {
  return (
    <div className="bg-white border-b border-zinc-200 px-3 sm:px-6 py-3 sm:py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 sm:gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-zinc-900">Laporan Keuangan</h1>
            <p className="text-sm text-zinc-600">Kelola dan pantau keuangan bisnis Anda</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageHeader;