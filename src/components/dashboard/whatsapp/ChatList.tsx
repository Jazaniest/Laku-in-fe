import {
  MessageCircle,
  Search,
  Loader2
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { WhatsAppChat } from '@/types/whatsapp.types';
import { formatDate } from '@/helper/formatDate';

const ChatList = ({
  chats,
  selectedChatId,
  onSelectChat,
  searchQuery,
  onSearchChange,
  loading
}: {
  chats: WhatsAppChat[];
  selectedChatId: string | null;
  onSelectChat: (chatId: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  loading?: boolean;
}) => {
  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="h-full flex flex-col">
        <div className="p-4 border-b border-zinc-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <Input
              placeholder="Cari chat..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              disabled
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          <div className="flex flex-col items-center justify-center h-full text-zinc-500">
            <Loader2 className="w-8 h-8 animate-spin mb-4" />
            <p>Loading chats...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-zinc-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <Input
            placeholder="Cari chat..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {filteredChats.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-zinc-500">
            <MessageCircle className="w-12 h-12 mb-2" />
            <p>Tidak ada chat</p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-200">
            {filteredChats.map((chat) => (
              <div
                key={chat.id}
                className={`p-4 cursor-pointer hover:bg-zinc-50 transition-colors ${
                  selectedChatId === chat.id ? 'bg-blue-50' : ''
                }`}
                onClick={() => onSelectChat(chat.id)}
              >
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={chat.profilePicture} />
                    <AvatarFallback className="bg-blue-600 text-white">
                      {chat.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-semibold text-sm truncate">{chat.name}</p>
                      {chat.lastMessageTime && (
                        <span className="text-xs text-zinc-500">
                          {formatDate(chat.lastMessageTime)}
                        </span>
                      )}
                    </div>
                    {chat.lastMessage && (
                      <p className="text-sm text-zinc-600 truncate">{chat.lastMessage}</p>
                    )}
                  </div>
                  {chat.unreadCount > 0 && (
                    <Badge className="bg-green-600 text-white">
                      {chat.unreadCount}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatList;