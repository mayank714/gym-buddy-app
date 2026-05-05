'use client';

import { useParams, useRouter } from 'next/navigation';
import { useRef, useEffect, useState } from 'react';
import { ArrowLeft, Send, Square } from 'lucide-react';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import Badge from '@/components/ui/Badge';
import MessageBubble from '@/components/chat/MessageBubble';
import { useConversation, useAddMessage, useEndConversation } from '@/hooks/useChat';
import { ChatMessage } from '@/types/chat.types';

export default function ConversationPage() {
  const { conversationId } = useParams<{ conversationId: string }>();
  const router = useRouter();
  const { data: conversation, isLoading } = useConversation(conversationId);
  const addMessage = useAddMessage(conversationId);
  const endConversation = useEndConversation();
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  const messages: ChatMessage[] = (() => {
    try {
      return JSON.parse(conversation?.messages || '[]');
    } catch {
      return [];
    }
  })();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  const handleSend = () => {
    const msg = input.trim();
    if (!msg || addMessage.isPending) return;
    setInput('');
    addMessage.mutate({ sender: 'user', message: msg });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!conversation) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-400">Conversation not found.</p>
        <Button variant="ghost" className="mt-4" onClick={() => router.back()}>
          Go back
        </Button>
      </div>
    );
  }

  const isActive = conversation.status === 'active';

  return (
    <div className="max-w-2xl mx-auto flex flex-col h-[calc(100vh-8rem)]">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <div className="flex items-center gap-2">
          <Badge variant={isActive ? 'active' : 'ended'}>{conversation.status}</Badge>
          {isActive && (
            <Button
              size="sm"
              variant="danger"
              loading={endConversation.isPending}
              onClick={() => endConversation.mutate(conversationId)}
            >
              <Square className="w-3 h-3" />
              End
            </Button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto flex flex-col gap-4 py-4 px-1">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <p className="text-slate-500 text-sm">
              {isActive
                ? 'Send a message to start chatting with Gym Buddy.'
                : 'No messages in this conversation.'}
            </p>
          </div>
        ) : (
          messages.map((msg, i) => <MessageBubble key={i} message={msg} />)
        )}
        <div ref={bottomRef} />
      </div>

      {isActive && (
        <div className="flex items-end gap-3 pt-4 border-t border-slate-800">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            placeholder="Message Gym Buddy…"
            className="flex-1 resize-none rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 max-h-32 overflow-y-auto"
          />
          <Button
            onClick={handleSend}
            loading={addMessage.isPending}
            disabled={!input.trim()}
            className="shrink-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
