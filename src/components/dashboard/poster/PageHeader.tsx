import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface PageHeaderProps {
  onBack: () => void;
}

const PageHeader = ({ onBack }: PageHeaderProps) => {
  return (
    <div className="bg-white border-b border-zinc-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-zinc-900">AI Poster Generator</h1>
            <p className="text-sm text-zinc-600">Upload foto produk untuk membuat poster menarik dengan AI</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
