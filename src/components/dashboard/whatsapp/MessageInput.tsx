import React, { useState } from 'react';
import {
  Loader2,
  Send
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

const MessageInput = ({
  onSend,
  disabled,
  sending
}: {
  onSend: (message: string) => void;
  disabled: boolean;
  sending: boolean;
}) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim() && !sending) {
      onSend(message);
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-4 border-t border-zinc-200 bg-white">
      <div className="flex gap-2">
        <Textarea
          placeholder="Ketik pesan..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={disabled}
          className="resize-none"
          rows={2}
        />
        <Button
          onClick={handleSend}
          disabled={disabled || !message.trim() || sending}
          size="icon"
          className="h-auto"
        >
          {sending ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </Button>
      </div>
    </div>
  );
};

export default MessageInput;