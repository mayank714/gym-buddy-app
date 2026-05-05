export interface ChatMessage {
  sender: string;
  message: string;
  timestamp?: string;
}

export interface Conversation {
  id: string;
  userId: string;
  messages: string;
  sessionId?: string;
  status: string;
  duration?: number;
  startedAt: string;
  endedAt?: string;
  transcript?: string;
  exerciseRecommendations?: string;
}

export interface AddMessageDto {
  sender: 'user' | 'assistant';
  message: string;
}

export interface UpdateTranscriptDto {
  transcript: string;
  exercises?: object[];
}
