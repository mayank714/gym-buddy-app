'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { chatService } from '@/services/chat.service';
import { AddMessageDto } from '@/types/chat.types';
import { getSession } from '@/utils/auth';
import { getAxiosErrorMessage } from '@/utils/helpers';

export function useChatHistory() {
  const session = getSession();
  return useQuery({
    queryKey: ['chat', session?.id],
    queryFn: () => chatService.getHistory(session!.id),
    enabled: !!session?.id,
  });
}

export function useConversation(id: string) {
  return useQuery({
    queryKey: ['conversation', id],
    queryFn: () => chatService.getById(id),
    enabled: !!id,
  });
}

export function useCreateConversation() {
  const qc = useQueryClient();
  const session = getSession();
  return useMutation({
    mutationFn: () => chatService.createConversation(session!.id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['chat', session?.id] });
    },
    onError: (err) => toast.error(getAxiosErrorMessage(err)),
  });
}

export function useAddMessage(conversationId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: AddMessageDto) => chatService.addMessage(conversationId, dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['conversation', conversationId] });
    },
    onError: (err) => toast.error(getAxiosErrorMessage(err)),
  });
}

export function useEndConversation() {
  const qc = useQueryClient();
  const session = getSession();
  return useMutation({
    mutationFn: (conversationId: string) => chatService.endConversation(conversationId),
    onSuccess: (updated) => {
      qc.invalidateQueries({ queryKey: ['conversation', updated.id] });
      qc.invalidateQueries({ queryKey: ['chat', session?.id] });
      toast.success('Conversation ended.');
    },
    onError: (err) => toast.error(getAxiosErrorMessage(err)),
  });
}
