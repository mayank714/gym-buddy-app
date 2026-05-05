import { ChatMessage } from '@/types/chat.types';
import { cn } from '@/utils/cn';
import { Zap, User } from 'lucide-react';

interface MessageBubbleProps {
  message: ChatMessage;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.sender === 'user';

  return (
    <div className={cn('flex items-end gap-2.5', isUser ? 'flex-row-reverse' : 'flex-row')}>
      <div
        className={cn(
          'w-7 h-7 rounded-full flex items-center justify-center shrink-0',
          isUser ? 'bg-slate-700' : 'bg-orange-500/20 border border-orange-500/30'
        )}
      >
        {isUser ? (
          <User className="w-3.5 h-3.5 text-slate-300" />
        ) : (
          <Zap className="w-3.5 h-3.5 text-orange-400" />
        )}
      </div>
      <div
        className={cn(
          'max-w-[75%] rounded-2xl px-4 py-2.5 text-sm',
          isUser
            ? 'bg-orange-500 text-white rounded-br-sm'
            : 'bg-slate-800 text-slate-200 border border-slate-700/50 rounded-bl-sm'
        )}
      >
        {message.message}
        {message.timestamp && (
          <p className={cn('text-xs mt-1', isUser ? 'text-orange-200/70' : 'text-slate-500')}>
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        )}
      </div>
    </div>
  );
}
