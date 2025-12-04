import { Loader2 } from 'lucide-react';

const LoadingState = () => {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="text-center">
        <Loader2 className="w-12 h-12 animate-spin text-zinc-900 mx-auto mb-4" />
        <p className="text-zinc-600">Memuat laporan keuangan...</p>
      </div>
    </div>
  );
};

export default LoadingState;