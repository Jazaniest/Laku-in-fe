import { useState } from 'react';
import {
  CheckCircle,
  Sparkles,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useReceiptUpload } from '@/hooks/useReceiptUpload';
import PageHeader from '@/components/dashboard/receipt/PageHeader';
import SuccessUpload from '@/components/dashboard/receipt/SuccessUpload';
import UploadZone from '@/components/dashboard/receipt/UploadZone';
import ProcessingStatus from '@/components/dashboard/receipt/ProcessingStatus';
import FailedUpload from '@/components/dashboard/receipt/FailedUpload';
import ExtractedDataReview from '@/components/dashboard/receipt/ExtractedDataReview';
import HistoryList from '@/components/dashboard/receipt/HistoryList';

const ReceiptUploadPage = () => {
  const {
    processing,
    currentUpload,
    uploadReceipt,
    confirmReceipt,
    retryUpload,
    reset
  } = useReceiptUpload();

  const [showSuccess, setShowSuccess] = useState(false);

  const handleBack = () => {
    window.location.href = '/dashboard';
  };

  const handleFileSelect = async (file: File): Promise<void> => {
    try {
      await uploadReceipt(file);
    } catch (err) {
      console.error('Upload error:', err instanceof Error ? err.message : 'Unknown error');
    }
  };

  const handleConfirm = async (): Promise<void> => {
    try {
      await confirmReceipt();
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        reset();
      }, 3000);
    } catch (err) {
      console.error('Confirm error:', err instanceof Error ? err.message : 'Unknown error');
    }
  };

  const handleRetry = async (): Promise<void> => {
    try {
      await retryUpload();
    } catch (err) {
      console.error('Retry error:', err instanceof Error ? err.message : 'Unknown error');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      <PageHeader onBack={handleBack} />

      <main className="p-6 max-w-7xl mx-auto">
        <div className="space-y-6">
          {/* Upload Section */}
          <div>
            {showSuccess ? (
              <SuccessUpload onNew={reset} />
            ) : !currentUpload ? (
              <UploadZone onFileSelect={handleFileSelect} />
            ) : currentUpload.status === 'processing' || processing ? (
              <ProcessingStatus />
            ) : currentUpload.status === 'failed' ? (
              <FailedUpload
                errorMessage={currentUpload.errorMessage || 'Upload gagal'}
                onRetry={handleRetry}
                onCancel={reset}
              />
            ) : currentUpload.status === 'completed' && currentUpload.extractedData ? (
              <ExtractedDataReview
                data={currentUpload.extractedData}
                imageUrl={currentUpload.imageUrl}
                confidence={currentUpload.confidence || 0}
                onConfirm={handleConfirm}
                onCancel={reset}
                confirming={processing}
              />
            ) : null}
          </div>

          {/* Tips Card */}
          {!currentUpload && (
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-blue-600" />
                  <CardTitle className="text-blue-900">Tips Upload Nota</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-blue-900">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" />
                    <span>Pastikan pencahayaan cukup dan teks terbaca dengan jelas</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" />
                    <span>Hindari bayangan dan pantulan cahaya pada nota</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" />
                    <span>Posisikan nota dalam frame dengan baik, tidak terpotong</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" />
                    <span>Format yang didukung: JPG, PNG, WebP (Max 5MB)</span>
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

export default ReceiptUploadPage;