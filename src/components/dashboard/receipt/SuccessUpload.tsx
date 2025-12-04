import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const SuccessUpload = ({ onNew }: { onNew: () => void }) => {
  return (
    <Card className="border-2 border-green-200 bg-green-50">
      <CardContent className="flex flex-col items-center justify-center py-12">
        <CheckCircle className="w-12 h-12 text-green-600 mb-4" />
        <h3 className="text-lg font-semibold text-zinc-900 mb-2">
          Berhasil Disimpan!
        </h3>
        <p className="text-sm text-zinc-600 text-center mb-6">
          Data nota telah ditambahkan ke laporan keuangan Anda
        </p>
        <Button onClick={onNew}>
          <Plus className="w-4 h-4 mr-2" />
          Upload Nota Lain
        </Button>
      </CardContent>
    </Card>
  );
};

export default SuccessUpload;