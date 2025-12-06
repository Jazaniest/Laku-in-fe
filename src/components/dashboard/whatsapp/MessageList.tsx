import {
  MessageCircle,
  MoreVertical
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { WhatsAppChat, WhatsAppMessage } from '@/types/whatsapp.types';
import { formatMessageTime } from '@/helper/formatMessageTime';

const MessageList = ({
  messages,
  selectedChat
}: {
  messages: WhatsAppMessage[];
  selectedChat: WhatsAppChat | null;
}) => {
  if (!selectedChat) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-zinc-500">
        <MessageCircle className="w-16 h-16 mb-4" />
        <p>Pilih chat untuk melihat pesan</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Chat Header */}
      <div className="p-4 border-b border-zinc-200 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={selectedChat.profilePicture} />
              <AvatarFallback className="bg-blue-600 text-white">
                {selectedChat.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{selectedChat.name}</p>
              <p className="text-xs text-zinc-500">
                {selectedChat.isGroup ? 'Group' : 'Personal'}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon">
            <MoreVertical className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-50">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-zinc-500">
            <p>Belum ada pesan</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.fromMe ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] rounded-lg px-4 py-2 ${
                  message.fromMe
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-zinc-900 border border-zinc-200'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.message}</p>
                <p
                  className={`text-xs mt-1 ${
                    message.fromMe ? 'text-blue-100' : 'text-zinc-500'
                  }`}
                >
                  {formatMessageTime(message.timestamp)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MessageList;