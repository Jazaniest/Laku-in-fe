import { useState } from 'react';
import {
  CheckCircle,
  Loader2,
  Edit3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { ExtractedReceiptData } from '@/types/receipt.types';
import { formatCurrency } from '@/helper/formatCurrency';

interface ExtractedDataReviewProps {
  data: ExtractedReceiptData;
  imageUrl: string;
  confidence: number;
  onConfirm: () => Promise<void> | void;
  onCancel: () => void;
  confirming: boolean;
}

const ExtractedDataReview = ({
  data,
  imageUrl,
  confidence,
  onConfirm,
  onCancel,
  confirming
}: ExtractedDataReviewProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<ExtractedReceiptData>(data);

  const getConfidenceBadge = () => {
    if (confidence >= 90) return <Badge className="bg-green-100 text-green-800">Confidence: {confidence}%</Badge>;
    if (confidence >= 75) return <Badge className="bg-yellow-100 text-yellow-800">Confidence: {confidence}%</Badge>;
    return <Badge className="bg-red-100 text-red-800">Confidence: {confidence}%</Badge>;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Image Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Foto Nota</CardTitle>
        </CardHeader>
        <CardContent>
          <img
            src={imageUrl}
            alt="Receipt"
            className="w-full rounded-lg border border-zinc-200"
          />
        </CardContent>
      </Card>

      {/* Extracted Data */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Data Terdeteksi</CardTitle>
            <div className="flex items-center gap-2">
              {getConfidenceBadge()}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
              >
                <Edit3 className="w-4 h-4 mr-2" />
                Edit
              </Button>
            </div>
          </div>
          <CardDescription>
            Periksa dan edit data jika diperlukan
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Merchant Info */}
          <div className="space-y-2">
            <Label>Nama Toko</Label>
            <Input
              value={editedData.merchantName || ''}
              onChange={(e) => setEditedData({ ...editedData, merchantName: e.target.value })}
              disabled={!isEditing}
            />
          </div>

          <div className="space-y-2">
            <Label>Tanggal</Label>
            <Input
              type="date"
              value={editedData.date.toISOString().split('T')[0]}
              onChange={(e) => setEditedData({ ...editedData, date: new Date(e.target.value) })}
              disabled={!isEditing}
            />
          </div>

          <div className="space-y-2">
            <Label>Metode Pembayaran</Label>
            <Select
              value={editedData.paymentMethod || 'cash'}
              onValueChange={(value) => setEditedData({ ...editedData, paymentMethod: value })}
              disabled={!isEditing}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Tunai</SelectItem>
                <SelectItem value="transfer">Transfer Bank</SelectItem>
                <SelectItem value="card">Kartu Kredit/Debit</SelectItem>
                <SelectItem value="e-wallet">E-Wallet</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Items */}
          <div className="space-y-2">
            <Label>Item ({editedData.items.length})</Label>
            <div className="border border-zinc-200 rounded-lg divide-y">
              {editedData.items.map((item, idx) => (
                <div key={idx} className="p-3 flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{item.name}</p>
                    <p className="text-xs text-zinc-600">
                      {item.quantity} x {formatCurrency(item.unitPrice)}
                    </p>
                  </div>
                  <p className="font-semibold">{formatCurrency(item.totalPrice)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="border-t pt-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-zinc-600">Subtotal</span>
              <span className="font-medium">{formatCurrency(editedData.subtotal)}</span>
            </div>
            {editedData.tax && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-600">Pajak</span>
                <span className="font-medium">{formatCurrency(editedData.tax)}</span>
              </div>
            )}
            {editedData.discount && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-600">Diskon</span>
                <span className="font-medium text-green-600">-{formatCurrency(editedData.discount)}</span>
              </div>
            )}
            <div className="flex items-center justify-between text-lg font-bold pt-2 border-t">
              <span>Total</span>
              <span>{formatCurrency(editedData.total)}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <Button
              onClick={onConfirm}
              disabled={confirming}
              className="flex-1"
            >
              {confirming ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Konfirmasi & Simpan
                </>
              )}
            </Button>
            <Button variant="outline" onClick={onCancel} disabled={confirming}>
              Batal
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExtractedDataReview;