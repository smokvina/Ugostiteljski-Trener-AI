export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  image?: string;
  feedback?: 'up' | 'down' | null;
  feedbackComment?: string;
}
