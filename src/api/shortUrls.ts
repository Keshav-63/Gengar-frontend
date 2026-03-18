import { apiClient } from './client';
import { ShortURLResponse } from '../types';

export interface ShortURLCreate {
  share_id: string;
  expires_in_days?: number;
}

export interface ShortURLStats {
  short_code: string;
  click_count: number;
  created_at: string;
  last_accessed?: string;
  is_active: boolean;
}

export const createShortURL = async (data: ShortURLCreate): Promise<ShortURLResponse> => {
  const response = await apiClient.post('/short-urls', data);
  return response.data;
};

export const getShortURLs = async () => {
  const response = await apiClient.get('/short-urls');
  return response.data;
};

export const getShortURLStats = async (shortCode: string): Promise<ShortURLStats> => {
  const response = await apiClient.get(`/short-urls/${shortCode}/stats`);
  return response.data;
};

export const deleteShortURL = async (shortCode: string) => {
  const response = await apiClient.delete(`/short-urls/${shortCode}`);
  return response.data;
};
