import api from './api';
import { Conversation, AddMessageDto, UpdateTranscriptDto } from '@/types/chat.types';

export const chatService = {
  createConversation: (userId: string) =>
    api.post<Conversation>(`/chat/conversation/create/${userId}`).then((r) => r.data),

  getHistory: (userId: string) =>
    api.get<Conversation[]>(`/chat/history/${userId}`).then((r) => r.data),

  getById: (conversationId: string) =>
    api.get<Conversation>(`/chat/conversation/${conversationId}`).then((r) => r.data),

  addMessage: (conversationId: string, dto: AddMessageDto) =>
    api.post<Conversation>(`/chat/message/${conversationId}`, dto).then((r) => r.data),

  endConversation: (conversationId: string) =>
    api.put<Conversation>(`/chat/conversation/${conversationId}/end`).then((r) => r.data),

  updateTranscript: (conversationId: string, dto: UpdateTranscriptDto) =>
    api
      .post<Conversation>(`/chat/conversation/${conversationId}/transcript`, dto)
      .then((r) => r.data),
};
