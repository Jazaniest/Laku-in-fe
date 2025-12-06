import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useWhatsApp } from '@/hooks/useWhatsapp';
import { useWhatsAppQR } from '@/hooks/useWhatsappQR';
import { useWhatsAppChat } from '@/hooks/useWhatsappChat';
import PageHeader from '@/components/dashboard/whatsapp/PageHeader';
import ConnectionStatus from '@/components/dashboard/whatsapp/ConnectionStatus';
import QRCodeDisplay from '@/components/dashboard/whatsapp/QRCodeDisplay';
import ChatList from '@/components/dashboard/whatsapp/ChatList';
import MessageList from '@/components/dashboard/whatsapp/MessageList';
import MessageInput from '@/components/dashboard/whatsapp/MessageInput';

const WhatsAppPage = () => {
  const { status, loading: statusLoading, disconnect } = useWhatsApp();
  const { qrCode, loading: qrLoading, requestQR, refreshQR } = useWhatsAppQR();
  const {
    chats,
    selectedChatId,
    messages,
    loading: chatLoading,
    sending,
    selectChat,
    sendMessage
  } = useWhatsAppChat();

  const [showQR, setShowQR] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleBack = () => {
    console.log('Navigate back to dashboard');
  };

  const handleConnect = async () => {
    setShowQR(true);
    await requestQR();
  };

  const handleDisconnect = async () => {
    if (confirm('Anda yakin ingin disconnect WhatsApp?')) {
      await disconnect();
      setShowQR(false);
    }
  };

  const handleSendMessage = async (message: string) => {
    if (!selectedChatId) return;

    try {
      await sendMessage({
        number: selectedChatId,
        message
      });
    } catch (error) {
      console.error('Send message error:', error);
    }
  };

  const selectedChat = chats.find(chat => chat.id === selectedChatId) || null;

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      <PageHeader onBack={handleBack} />

      <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
        <div className="space-y-6">
          {/* Connection Status */}
          <ConnectionStatus
            status={status}
            onConnect={handleConnect}
            onDisconnect={handleDisconnect}
            loading={statusLoading}
          />

          {/* QR Code Display */}
          {showQR && !status?.connected && (
            <QRCodeDisplay
              qrCode={qrCode}
              loading={qrLoading}
              onRefresh={refreshQR}
              onClose={() => setShowQR(false)}
            />
          )}

          {/* Chat Interface */}
          {status?.connected && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
              {/* Chat List */}
              <Card className="lg:col-span-1">
                <CardHeader className="pb-4">
                  <CardTitle>Chats</CardTitle>
                  <CardDescription>{chats.length} percakapan</CardDescription>
                </CardHeader>
                <CardContent className="p-0 h-[calc(100%-80px)]">
                  <ChatList
                    chats={chats}
                    selectedChatId={selectedChatId}
                    onSelectChat={selectChat}
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    loading={chatLoading}
                  />
                </CardContent>
              </Card>

              {/* Messages */}
              <Card className="lg:col-span-2 flex flex-col">
                <CardContent className="p-0 flex-1 flex flex-col">
                  <MessageList messages={messages} selectedChat={selectedChat} />
                  {selectedChat && (
                    <MessageInput
                      onSend={handleSendMessage}
                      disabled={!selectedChat || sending}
                      sending={sending}
                    />
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Instructions */}
          {!status?.connected && !showQR && (
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-900">Cara Menghubungkan WhatsApp</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-2 text-sm text-blue-900">
                  <li className="flex items-start gap-2">
                    <span className="font-semibold">1.</span>
                    <span>Klik tombol "Connect WhatsApp" di atas</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-semibold">2.</span>
                    <span>Buka WhatsApp di HP Anda</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-semibold">3.</span>
                    <span>Tap Settings → Linked Devices → Link a Device</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-semibold">4.</span>
                    <span>Scan QR code yang muncul di layar</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-semibold">5.</span>
                    <span>Tunggu beberapa saat hingga koneksi berhasil</span>
                  </li>
                </ol>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default WhatsAppPage;