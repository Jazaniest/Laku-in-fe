import { Card, CardContent } from '@/components/ui/card';
import { XCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FailedGenerationProps {
  errorMessage: string;
  onRetry: () => void;
  onCancel: () => void;
}

const FailedGeneration = ({ errorMessage, onRetry, onCancel }: FailedGenerationProps) => {
  return (
    <Card className="border-2 border-red-200 bg-red-50">
      <CardContent className="flex flex-col items-center justify-center py-12">
        <XCircle className="w-12 h-12 text-red-600 mb-4" />
        <h3 className="text-lg font-semibold text-zinc-900 mb-2">
          Generasi Gagal
        </h3>
        <p className="text-sm text-zinc-600 text-center mb-6 max-w-md">
          {errorMessage}
        </p>
        <div className="flex gap-2">
          <Button onClick={onRetry} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Coba Lagi
          </Button>
          <Button onClick={onCancel}>
            Upload Ulang
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FailedGeneration;
