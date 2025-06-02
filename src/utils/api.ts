import axios from 'axios';
import { AIRequest, AIResponse, Email } from '@/types';

const api = axios.create({
  baseURL: '/api',
});

export const getEmails = async (): Promise<Email[]> => {
  const response = await api.get('/emails');
  return response.data;
};

export const createEmail = async (email: Omit<Email, 'id' | 'createdAt' | 'updatedAt' | 'userId'>): Promise<Email> => {
  const response = await api.post('/emails', email);
  return response.data;
};

export const processAIRequest = async (request: AIRequest): Promise<AIResponse> => {
  const response = await api.post('/ai', request);
  return response.data;
}; 