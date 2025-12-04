import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Download, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SuccessGenerationProps {
  onDownload: () => void;
  onNew: () => void;
  downloading?: boolean;
}

const SuccessGeneration = ({ onDownload, onNew, downloading = false }: SuccessGenerationProps) => {
  return (
    <Card className="border-2 border-green-200 bg-green-50">
      <CardContent className="flex flex-col items-center justify-center py-12">
        <CheckCircle className="w-12 h-12 text-green-600 mb-4" />
        <h3 className="text-lg font-semibold text-zinc-900 mb-2">
          Poster Berhasil Dibuat!
        </h3>
        <p className="text-sm text-zinc-600 text-center mb-6">
          Poster Anda siap untuk diunduh dan digunakan
        </p>
        <div className="flex gap-2">
          <Button onClick={onDownload} disabled={downloading}>
            <Download className="w-4 h-4 mr-2" />
            {downloading ? 'Mengunduh...' : 'Unduh Poster'}
          </Button>
          <Button onClick={onNew} variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Buat Poster Baru
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SuccessGeneration;
