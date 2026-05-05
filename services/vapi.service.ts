import api from './api';

export const vapiService = {
  startCall: (userId: string) =>
    api.post(`/vapi/call/start/${userId}`).then((r) => r.data),

  sendChat: (userId: string, message: string) =>
    api.post(`/vapi/chat/send/${userId}`, { message }).then((r) => r.data),

  sendWebhook: (payload: unknown) =>
    api.post('/vapi/webhook', payload).then((r) => r.data),
};
