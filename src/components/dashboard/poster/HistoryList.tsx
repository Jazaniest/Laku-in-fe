import { useState } from 'react';
import {
  FileImage,
  Loader2,
  Eye,
  Trash2,
  Download
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
import { usePosterHistory } from '@/hooks/usePosterHistory';
import { formatDate } from '@/helper/formatDate';
import { formatFileSize } from '@/helper/fileFormatSize';
import type { GeneratedPoster } from '@/types/poster.types';

const HistoryList = () => {
  const { data, loading, deletePoster } = usePosterHistory();
  const [selectedPoster, setSelectedPoster] = useState<GeneratedPoster | null>(null);

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
          <CardTitle>Riwayat Poster</CardTitle>
          <CardDescription>Poster yang telah dibuat</CardDescription>
        </CardHeader>
        <CardContent>
          {data.length === 0 ? (
            <div className="text-center py-8 text-zinc-500">
              Belum ada riwayat poster
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
                      <p className="font-medium text-sm">{history.poster.fileName}</p>
                      <div className="flex items-center gap-2 text-xs text-zinc-500 mt-1">
                        <span>{formatDate(history.poster.uploadedAt)}</span>
                        <span>•</span>
                        <span>{formatFileSize(history.poster.fileSize)}</span>
                        {history.poster.style && (
                          <>
                            <span>•</span>
                            <span className="capitalize">{history.poster.style}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(history.poster.status)}
                    {history.downloaded && (
                      <Badge className="bg-blue-100 text-blue-800">
                        <Download className="w-3 h-3 mr-1" />
                        Diunduh
                      </Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedPoster(history.poster)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deletePoster(history.poster.id)}
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
      <Dialog open={!!selectedPoster} onOpenChange={() => setSelectedPoster(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detail Poster</DialogTitle>
            <DialogDescription>
              {selectedPoster?.fileName}
            </DialogDescription>
          </DialogHeader>
          {selectedPoster && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-zinc-600">Status</p>
                  <p className="font-medium capitalize">{selectedPoster.status}</p>
                </div>
                <div>
                  <p className="text-zinc-600">Confidence</p>
                  <p className="font-medium">{selectedPoster.confidence}%</p>
                </div>
                <div>
                  <p className="text-zinc-600">Dibuat</p>
                  <p className="font-medium">{formatDate(selectedPoster.uploadedAt)}</p>
                </div>
                <div>
                  <p className="text-zinc-600">Gaya</p>
                  <p className="font-medium capitalize">{selectedPoster.style || '-'}</p>
                </div>
                <div>
                  <p className="text-zinc-600">Template</p>
                  <p className="font-medium capitalize">{selectedPoster.template || '-'}</p>
                </div>
                <div>
                  <p className="text-zinc-600">Ukuran File</p>
                  <p className="font-medium">{formatFileSize(selectedPoster.fileSize)}</p>
                </div>
              </div>
              {selectedPoster.editedData?.title && (
                <div className="border-t pt-4">
                  <p className="text-sm text-zinc-600 mb-2">Judul Poster</p>
                  <p className="font-medium">{selectedPoster.editedData.title}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default HistoryList;
