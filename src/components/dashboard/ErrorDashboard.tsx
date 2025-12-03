import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const ErrorDashboard = ({ message, onRetry }: { message: string; onRetry: () => void }) => {
  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle className="text-red-600">Terjadi Kesalahan</CardTitle>
          <CardDescription>{message}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={onRetry} className="w-full">
            Coba Lagi
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ErrorDashboard