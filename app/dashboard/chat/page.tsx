'use client';

import { useRouter } from 'next/navigation';
import { MessageCircle, Plus } from 'lucide-react';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import ConversationCard from '@/components/chat/ConversationCard';
import { useChatHistory, useCreateConversation } from '@/hooks/useChat';

export default function ChatPage() {
  const router = useRouter();
  const { data: history, isLoading } = useChatHistory();
  const createConversation = useCreateConversation();

  const handleNew = () => {
    createConversation.mutate(undefined, {
      onSuccess: (conv) => router.push(`/dashboard/chat/${conv.id}`),
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Chat</h1>
          <p className="text-slate-400 text-sm mt-0.5">
            {history?.length ?? 0} conversation{history?.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Button onClick={handleNew} loading={createConversation.isPending}>
          <Plus className="w-4 h-4" />
          New Chat
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Spinner size="lg" />
        </div>
      ) : history && history.length > 0 ? (
        <div className="flex flex-col gap-3">
          {history.map((conv) => (
            <ConversationCard key={conv.id} conversation={conv} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center py-20 text-center">
          <MessageCircle className="w-10 h-10 text-slate-700 mb-4" />
          <p className="text-slate-300 font-medium">No conversations yet</p>
          <p className="text-slate-500 text-sm mb-4">
            Start a chat with your AI fitness assistant.
          </p>
          <Button onClick={handleNew} loading={createConversation.isPending}>
            <Plus className="w-4 h-4" />
            Start a Conversation
          </Button>
        </div>
      )}
    </div>
  );
}
