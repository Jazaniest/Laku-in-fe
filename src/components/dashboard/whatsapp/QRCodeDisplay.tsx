import {
  XCircle,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const QRCodeDisplay = ({
  qrCode,
  loading,
  onRefresh,
  onClose
}: {
  qrCode: string | null;
  loading: boolean;
  onRefresh: () => void;
  onClose: () => void;
}) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Scan QR Code</CardTitle>
            <CardDescription>Buka WhatsApp di HP → Settings → Linked Devices → Link a Device</CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <XCircle className="w-5 h-5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        {loading ? (
          <div className="flex flex-col items-center py-12">
            <Loader2 className="w-12 h-12 animate-spin text-blue-600 mb-4" />
            <p className="text-zinc-600">Generating QR code...</p>
          </div>
        ) : qrCode ? (
          <>
            <div className="bg-white p-4 rounded-lg border-2 border-zinc-200">
              <img
                src={qrCode}
                alt="WhatsApp QR Code"
                className="w-64 h-64"
              />
            </div>
            <div className="mt-6 space-y-4 text-center">
              <Button variant="outline" onClick={onRefresh}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh QR Code
              </Button>
              <div className="max-w-md">
                <p className="text-sm text-zinc-600">
                  QR code akan otomatis refresh setiap 30 detik. Setelah scan berhasil, 
                  koneksi akan langsung aktif.
                </p>
              </div>
            </div>
          </>
        ) : (
          <div className="py-12 text-center">
            <p className="text-zinc-600 mb-4">QR code tidak tersedia</p>
            <Button onClick={onRefresh}>Generate QR Code</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QRCodeDisplay;