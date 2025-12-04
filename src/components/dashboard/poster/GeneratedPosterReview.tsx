import { useState } from 'react';
import {
  CheckCircle,
  Loader2,
  Edit3,
  Download
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
import { Textarea } from '@/components/ui/textarea';
import type { PosterEditData } from '@/types/poster.types';
import { formatCurrency } from '@/helper/formatCurrency';

interface GeneratedPosterReviewProps {
  data: PosterEditData;
  originalImageUrl: string;
  generatedImageUrl: string;
  confidence: number;
  onConfirm: () => void;
  onDownload: () => void;
  onCancel: () => void;
  confirming: boolean;
  downloading?: boolean;
}

const GeneratedPosterReview = ({
  data,
  originalImageUrl,
  generatedImageUrl,
  confidence,
  onConfirm,
  onDownload,
  onCancel,
  confirming,
  downloading = false
}: GeneratedPosterReviewProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<PosterEditData>(data);

  const getConfidenceBadge = () => {
    if (confidence >= 90) return <Badge className="bg-green-100 text-green-800">Confidence: {confidence}%</Badge>;
    if (confidence >= 75) return <Badge className="bg-yellow-100 text-yellow-800">Confidence: {confidence}%</Badge>;
    return <Badge className="bg-red-100 text-red-800">Confidence: {confidence}%</Badge>;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Original Image */}
      <Card>
        <CardHeader>
          <CardTitle>Foto Asli</CardTitle>
        </CardHeader>
        <CardContent>
          <img
            src={originalImageUrl}
            alt="Original"
            className="w-full rounded-lg border border-zinc-200"
          />
        </CardContent>
      </Card>

      {/* Generated Poster */}
      <Card>
        <CardHeader>
          <CardTitle>Poster yang Dihasilkan</CardTitle>
        </CardHeader>
        <CardContent>
          <img
            src={generatedImageUrl}
            alt="Generated Poster"
            className="w-full rounded-lg border border-zinc-200"
          />
        </CardContent>
      </Card>

      {/* Edit Data */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Detail Poster</CardTitle>
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
            Periksa dan edit detail poster jika diperlukan
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <Label>Judul Poster</Label>
            <Input
              value={editedData.title || ''}
              onChange={(e) => setEditedData({ ...editedData, title: e.target.value })}
              disabled={!isEditing}
              placeholder="Masukkan judul poster"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label>Deskripsi</Label>
            <Textarea
              value={editedData.description || ''}
              onChange={(e) => setEditedData({ ...editedData, description: e.target.value })}
              disabled={!isEditing}
              placeholder="Masukkan deskripsi produk"
              rows={3}
            />
          </div>

          {/* Price and Discount */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Harga</Label>
              <Input
                type="number"
                value={editedData.price || ''}
                onChange={(e) => setEditedData({ ...editedData, price: Number(e.target.value) })}
                disabled={!isEditing}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label>Diskon (%)</Label>
              <Input
                type="number"
                min="0"
                max="100"
                value={editedData.discount || ''}
                onChange={(e) => setEditedData({ ...editedData, discount: Number(e.target.value) })}
                disabled={!isEditing}
                placeholder="0"
              />
            </div>
          </div>

          {/* Call to Action */}
          <div className="space-y-2">
            <Label>Call to Action</Label>
            <Input
              value={editedData.callToAction || ''}
              onChange={(e) => setEditedData({ ...editedData, callToAction: e.target.value })}
              disabled={!isEditing}
              placeholder="Contoh: Pesan Sekarang"
            />
          </div>

          {/* Style and Template */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Gaya</Label>
              <Select
                value={editedData.style || 'modern'}
                onValueChange={(value) => setEditedData({ ...editedData, style: value })}
                disabled={!isEditing}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="modern">Modern</SelectItem>
                  <SelectItem value="vintage">Vintage</SelectItem>
                  <SelectItem value="minimalist">Minimalist</SelectItem>
                  <SelectItem value="bold">Bold</SelectItem>
                  <SelectItem value="elegant">Elegant</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Template</Label>
              <Select
                value={editedData.template || 'product'}
                onValueChange={(value) => setEditedData({ ...editedData, template: value })}
                disabled={!isEditing}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="product">Produk</SelectItem>
                  <SelectItem value="food">Makanan</SelectItem>
                  <SelectItem value="promotion">Promosi</SelectItem>
                  <SelectItem value="social-media">Social Media</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Colors */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Warna Latar</Label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={editedData.backgroundColor || '#FFFFFF'}
                  onChange={(e) => setEditedData({ ...editedData, backgroundColor: e.target.value })}
                  disabled={!isEditing}
                  className="w-10 h-10 rounded cursor-pointer"
                />
                <span className="text-sm text-zinc-600">{editedData.backgroundColor}</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Warna Teks</Label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={editedData.textColor || '#000000'}
                  onChange={(e) => setEditedData({ ...editedData, textColor: e.target.value })}
                  disabled={!isEditing}
                  className="w-10 h-10 rounded cursor-pointer"
                />
                <span className="text-sm text-zinc-600">{editedData.textColor}</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Warna Aksen</Label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={editedData.accentColor || '#FF6B6B'}
                  onChange={(e) => setEditedData({ ...editedData, accentColor: e.target.value })}
                  disabled={!isEditing}
                  className="w-10 h-10 rounded cursor-pointer"
                />
                <span className="text-sm text-zinc-600">{editedData.accentColor}</span>
              </div>
            </div>
          </div>

          {/* Summary */}
          {editedData.price && (
            <div className="border-t pt-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-600">Harga Normal</span>
                <span className="font-medium">{formatCurrency(editedData.price)}</span>
              </div>
              {editedData.discount && editedData.discount > 0 && (
                <>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-600">Diskon ({editedData.discount}%)</span>
                    <span className="font-medium text-green-600">
                      -{formatCurrency((editedData.price * editedData.discount) / 100)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-lg font-bold pt-2 border-t">
                    <span>Harga Akhir</span>
                    <span>{formatCurrency(editedData.price - (editedData.price * editedData.discount) / 100)}</span>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <Button
              onClick={onDownload}
              disabled={downloading}
              variant="outline"
              className="flex-1"
            >
              {downloading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Mengunduh...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Unduh Poster
                </>
              )}
            </Button>
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
                  Simpan & Lanjut
                </>
              )}
            </Button>
            <Button variant="outline" onClick={onCancel} disabled={confirming || downloading}>
              Batal
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GeneratedPosterReview;
