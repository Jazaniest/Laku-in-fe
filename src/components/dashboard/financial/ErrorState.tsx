import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

const ErrorState = ({ message, onRetry }: { message: string; onRetry: () => void }) => {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12">
        <X className="w-12 h-12 text-red-500 mb-4" />
        <p className="text-zinc-900 font-semibold mb-2">Terjadi Kesalahan</p>
        <p className="text-zinc-600 mb-4">{message}</p>
        <Button onClick={onRetry}>Coba Lagi</Button>
      </CardContent>
    </Card>
  );
};

export default ErrorState