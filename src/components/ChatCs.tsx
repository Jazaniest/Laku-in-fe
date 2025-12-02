import { useState } from 'react';
import { X, Send, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

const ChatCs = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { type: 'cs', text: 'Halo! Ada yang bisa kami bantu?' }
  ]);

  const handleSendMessage = () => {
    if (message.trim()) {
      setMessages([...messages, { type: 'user', text: message }]);
      setMessage('');
      
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          type: 'cs', 
          text: 'Terima kasih telah menghubungi kami. Tim CS kami akan segera membantu Anda!' 
        }]);
      }, 1000);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <Card className="w-80 sm:w-96 shadow-2xl">
          <CardHeader className="bg-zinc-900 text-white rounded-t-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                <CardTitle className="text-lg text-white">Customer Service</CardTitle>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-zinc-800"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <CardDescription className="text-zinc-300">
              Kami siap membantu Anda
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <div className="h-64 overflow-y-auto mb-4 space-y-3">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[75%] rounded-lg px-4 py-2 ${
                      msg.type === 'user'
                        ? 'bg-zinc-900 text-white'
                        : 'bg-zinc-100 text-zinc-900'
                    }`}
                  >
                    <p className="text-sm">{msg.text}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Ketik pesan..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <Button size="icon" onClick={handleSendMessage}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Button
          size="lg"
          className="rounded-full w-14 h-14 shadow-2xl"
          onClick={() => setIsOpen(true)}
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      )}
    </div>
  );
};

export default ChatCs;