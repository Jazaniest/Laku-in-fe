import { useState } from 'react';
import {
  CheckCircle,
  Sparkles,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePosterGenerator } from '@/hooks/usePosterGenerator';
import PageHeader from '@/components/dashboard/poster/PageHeader';
import SuccessGeneration from '@/components/dashboard/poster/SuccessGeneration';
import UploadZone from '@/components/dashboard/poster/UploadZone';
import ProcessingStatus from '@/components/dashboard/poster/ProcessingStatus';
import FailedGeneration from '@/components/dashboard/poster/FailedGeneration';
import GeneratedPosterReview from '@/components/dashboard/poster/GeneratedPosterReview';
import HistoryList from '@/components/dashboard/poster/HistoryList';

const AIPosterGeneratorPage = () => {
  const {
    processing,
    currentPoster,
    uploadAndGenerate,
    confirmAndSave,
    retryGeneration,
    downloadPoster,
    reset
  } = usePosterGenerator();

  const [showSuccess, setShowSuccess] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const handleBack = () => {
    window.location.href = '/dashboard';
  };

  const handleFileSelect = async (file: File): Promise<void> => {
    try {
      await uploadAndGenerate(file);
    } catch (err) {
      console.error('Upload error:', err instanceof Error ? err.message : 'Unknown error');
    }
  };

  const handleConfirm = async (): Promise<void> => {
    try {
      await confirmAndSave();
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        reset();
      }, 3000);
    } catch (err) {
      console.error('Confirm error:', err instanceof Error ? err.message : 'Unknown error');
    }
  };

  const handleDownload = async (): Promise<void> => {
    try {
      setDownloading(true);
      const downloadUrl = await downloadPoster();
      console.log('Download URL:', downloadUrl);
      // Implement actual download logic here
    } catch (err) {
      console.error('Download error:', err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setDownloading(false);
    }
  };

  const handleRetry = async (): Promise<void> => {
    try {
      await retryGeneration();
    } catch (err) {
      console.error('Retry error:', err instanceof Error ? err.message : 'Unknown error');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      <PageHeader onBack={handleBack} />

      <main className="p-6 max-w-7xl mx-auto">
        <div className="space-y-6">
          {/* Generation Section */}
          <div>
            {showSuccess ? (
              <SuccessGeneration onNew={reset} onDownload={handleDownload} downloading={downloading} />
            ) : !currentPoster ? (
              <UploadZone onFileSelect={handleFileSelect} />
            ) : currentPoster.status === 'processing' || processing ? (
              <ProcessingStatus status={currentPoster.status} />
            ) : currentPoster.status === 'failed' ? (
              <FailedGeneration
                errorMessage={currentPoster.errorMessage || 'Generasi gagal'}
                onRetry={handleRetry}
                onCancel={reset}
              />
            ) : currentPoster.status === 'completed' && currentPoster.editedData ? (
              <GeneratedPosterReview
                data={currentPoster.editedData}
                originalImageUrl={currentPoster.originalImageUrl}
                generatedImageUrl={currentPoster.generatedImageUrl}
                confidence={currentPoster.confidence || 0}
                onConfirm={handleConfirm}
                onDownload={handleDownload}
                onCancel={reset}
                confirming={processing}
                downloading={downloading}
              />
            ) : null}
          </div>

          {/* Tips Card */}
          {!currentPoster && (
            <Card className="bg-purple-50 border-purple-200">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  <CardTitle className="text-purple-900">Tips Membuat Poster Terbaik</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-purple-900">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" />
                    <span>Gunakan foto produk atau makanan dengan pencahayaan yang baik</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" />
                    <span>Hindari latar belakang yang berantakan atau terlalu kompleks</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" />
                    <span>Pastikan produk terlihat jelas dan menjadi fokus utama</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" />
                    <span>Format yang didukung: JPG, PNG, WebP (Max 10MB)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" />
                    <span>Anda dapat mengedit detail poster setelah AI membuat desainnya</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          )}

          {/* History */}
          <HistoryList />
        </div>
      </main>
    </div>
  );
};

export default AIPosterGeneratorPage;
