import { useState } from 'react';
import {
  FileImage,
  Loader2,
  Eye,
  Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useReceiptHistory } from '@/hooks/useReceiptHistory';
import { formatDate } from '@/helper/formatDate';
import { formatFileSize } from '@/helper/fileFormatSize';
import type { ReceiptUpload } from '@/types/receipt.types';

const HistoryList = () => {
  const { data, loading, deleteReceipt } = useReceiptHistory();
  const [selectedReceipt, setSelectedReceipt] = useState<ReceiptUpload | null>(null);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Selesai</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800">Gagal</Badge>;
      case 'processing':
        return <Badge className="bg-yellow-100 text-yellow-800">Proses</Badge>;
      default:
        return <Badge>-</Badge>;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Riwayat Upload</CardTitle>
          <CardDescription>Nota yang sudah diupload</CardDescription>
        </CardHeader>
        <CardContent>
          {data.length === 0 ? (
            <div className="text-center py-8 text-zinc-500">
              Belum ada riwayat upload
            </div>
          ) : (
            <div className="space-y-3">
              {data.slice(0, 10).map((history) => (
                <div
                  key={history.id}
                  className="flex items-center justify-between p-4 border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-12 h-12 bg-zinc-100 rounded-lg flex items-center justify-center">
                      <FileImage className="w-6 h-6 text-zinc-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{history.receipt.fileName}</p>
                      <div className="flex items-center gap-2 text-xs text-zinc-500 mt-1">
                        <span>{formatDate(history.receipt.uploadedAt)}</span>
                        <span>•</span>
                        <span>{formatFileSize(history.receipt.fileSize)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(history.receipt.status)}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedReceipt(history.receipt)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteReceipt(history.receipt.id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={!!selectedReceipt} onOpenChange={() => setSelectedReceipt(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detail Upload</DialogTitle>
            <DialogDescription>
              {selectedReceipt?.fileName}
            </DialogDescription>
          </DialogHeader>
          {selectedReceipt && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-zinc-600">Status</p>
                  <p className="font-medium">{selectedReceipt.status}</p>
                </div>
                <div>
                  <p className="text-zinc-600">Confidence</p>
                  <p className="font-medium">{selectedReceipt.confidence}%</p>
                </div>
                <div>
                  <p className="text-zinc-600">Uploaded</p>
                  <p className="font-medium">{formatDate(selectedReceipt.uploadedAt)}</p>
                </div>
                <div>
                  <p className="text-zinc-600">Transaction ID</p>
                  <p className="font-medium">{selectedReceipt.transactionId || '-'}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default HistoryList;