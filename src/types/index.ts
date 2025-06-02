import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
    } & DefaultSession['user'];
  }
}

export interface Email {
  id: string;
  subject: string;
  content: string;
  from: string;
  to: string[];
  cc: string[];
  bcc: string[];
  status: 'draft' | 'sent' | 'archived';
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export interface AIResponse {
  content: string;
  error?: string;
}

export interface AIRequest {
  action: 'generate' | 'improve' | 'translate' | 'summarize';
  content: string;
  language?: string;
} 