import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PageHeader = ({ onBack }: { onBack: () => void }) => {
  return (
    <div className="bg-white border-b border-zinc-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-zinc-900">WhatsApp Integration</h1>
            <p className="text-sm text-zinc-600">Kelola koneksi WhatsApp untuk customer service</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageHeader;