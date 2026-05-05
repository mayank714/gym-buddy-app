'use client';

import { useRouter } from 'next/navigation';
import { MessageCircle, Clock, ChevronRight } from 'lucide-react';
import { Conversation } from '@/types/chat.types';
import { Card } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { formatDate } from '@/utils/helpers';

interface ConversationCardProps {
  conversation: Conversation;
}

export default function ConversationCard({ conversation }: ConversationCardProps) {
  const router = useRouter();

  let msgCount = 0;
  try {
    const msgs = JSON.parse(conversation.messages || '[]');
    msgCount = Array.isArray(msgs) ? msgs.length : 0;
  } catch { /* */ }

  return (
    <Card
      hover
      className="flex items-center gap-4 cursor-pointer"
      onClick={() => router.push(`/dashboard/chat/${conversation.id}`)}
    >
      <div className="w-10 h-10 rounded-xl bg-slate-700/60 flex items-center justify-center shrink-0">
        <MessageCircle className="w-5 h-5 text-orange-400" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <p className="text-sm font-medium text-white">Session</p>
          <Badge variant={conversation.status === 'active' ? 'active' : 'ended'}>
            {conversation.status}
          </Badge>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span>{formatDate(conversation.startedAt)}</span>
          {conversation.duration && (
            <>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {conversation.duration}s
              </span>
            </>
          )}
          {msgCount > 0 && (
            <>
              <span>·</span>
              <span>{msgCount} messages</span>
            </>
          )}
        </div>
      </div>
      <ChevronRight className="w-4 h-4 text-slate-600 shrink-0" />
    </Card>
  );
}
