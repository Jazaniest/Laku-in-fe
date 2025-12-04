import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { Sparkles } from 'lucide-react';

const ProcessingStatus = () => {
  return (
    <Card className="border-2 border-blue-200 bg-blue-50">
      <CardContent className="flex flex-col items-center justify-center py-12">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
        <h3 className="text-lg font-semibold text-zinc-900 mb-2">
          Menganalisis Nota...
        </h3>
        <p className="text-sm text-zinc-600 text-center">
          AI sedang membaca dan mengekstrak data dari nota Anda
        </p>
        <div className="mt-4 flex items-center gap-2 text-sm text-blue-600">
          <Sparkles className="w-4 h-4" />
          <span>Powered by AI</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProcessingStatus;