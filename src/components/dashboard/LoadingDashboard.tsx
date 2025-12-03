import { Loader2 } from 'lucide-react';

const LoadingDashboard = () => {
  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-12 h-12 animate-spin text-zinc-900 mx-auto mb-4" />
        <p className="text-zinc-600">Memuat dashboard...</p>
      </div>
    </div>
  );
};

export default LoadingDashboard;
