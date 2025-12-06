import {
  QrCode,
  CheckCircle,
  XCircle,
  Loader2,
  Power,
  User,
  Phone
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { WhatsAppStatus } from '@/types/whatsapp.types';

const ConnectionStatus = ({
  status,
  onConnect,
  onDisconnect,
  loading
}: {
  status: WhatsAppStatus | null;
  onConnect: () => void;
  onDisconnect: () => void;
  loading: boolean;
}) => {
  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
        </CardContent>
      </Card>
    );
  }

  if (!status) {
    return null;
  }

  if (status.connected) {
    return (
      <Card className="border-2 border-green-200 bg-green-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-green-900">WhatsApp Terhubung</h3>
                <p className="text-sm text-green-700 mt-1">
                  <Phone className="w-3 h-3 inline mr-1" />
                  {status.phoneNumber || 'Nomor tidak tersedia'}
                </p>
                {status.profileName && (
                  <p className="text-sm text-green-700">
                    <User className="w-3 h-3 inline mr-1" />
                    {status.profileName}
                  </p>
                )}
              </div>
            </div>
            <Button
              variant="outline"
              onClick={onDisconnect}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Power className="w-4 h-4 mr-2" />
              Disconnect
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-orange-200 bg-orange-50">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center">
              <XCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-orange-900">WhatsApp Tidak Terhubung</h3>
              <p className="text-sm text-orange-700 mt-1">
                Scan QR code untuk menghubungkan WhatsApp
              </p>
            </div>
          </div>
          <Button onClick={onConnect}>
            <QrCode className="w-4 h-4 mr-2" />
            Connect WhatsApp
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ConnectionStatus;