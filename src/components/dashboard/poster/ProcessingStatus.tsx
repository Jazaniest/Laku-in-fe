import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Sparkles } from 'lucide-react';

interface ProcessingStatusProps {
  status: string;
}

const ProcessingStatus = ({ status: _status }: ProcessingStatusProps) => {
  return (
    <Card className="border-2 border-purple-200 bg-purple-50">
      <CardContent className="flex flex-col items-center justify-center py-12">
        <Loader2 className="w-12 h-12 text-purple-600 animate-spin mb-4" />
        <h3 className="text-lg font-semibold text-zinc-900 mb-2">
          Membuat Poster...
        </h3>
        <p className="text-sm text-zinc-600 text-center">
          AI sedang menganalisis gambar dan membuat poster yang menarik
        </p>
        <div className="mt-4 flex items-center gap-2 text-sm text-purple-600">
          <Sparkles className="w-4 h-4" />
          <span>Powered by AI</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProcessingStatus;
