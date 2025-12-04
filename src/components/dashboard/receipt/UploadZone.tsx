import { useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, Camera, FileImage } from 'lucide-react';
import { Button } from '@/components/ui/button';

const UploadZone = ({ onFileSelect }: { onFileSelect: (file: File) => void }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <Card
      className={`border-2 border-dashed transition-colors cursor-pointer ${
        dragActive ? 'border-blue-500 bg-blue-50' : 'border-zinc-300 hover:border-zinc-400'
      }`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <CardContent className="flex flex-col items-center justify-center py-12">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <Upload className="w-8 h-8 text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold text-zinc-900 mb-2">
          Upload Foto Nota
        </h3>
        <p className="text-sm text-zinc-600 text-center mb-4">
          Drag & drop foto nota atau klik untuk browse
        </p>
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <FileImage className="w-4 h-4" />
          <span>Format: JPG, PNG, WebP (Max 5MB)</span>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={handleChange}
          className="hidden"
        />
        <div className="mt-6 flex gap-2">
          <Button variant="outline" size="sm" onClick={(e) => e.stopPropagation()}>
            <Camera className="w-4 h-4 mr-2" />
            Ambil Foto
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UploadZone;