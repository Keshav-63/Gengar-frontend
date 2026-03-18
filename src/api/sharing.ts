import { apiClient } from './client';
import { ShareResponse } from '../types';

export interface ShareCreate {
  resource_type: 'file' | 'folder';
  resource_id: string;
  permission: 'view' | 'download' | 'edit';
  expires_in_days?: number;
}

export interface ShareUpdate {
  permission?: 'view' | 'download' | 'edit';
  expires_in_days?: number;
}

export interface ShareAccessResponse {
  resource_type: string;
  resource_name: string;
  permission: string;
  download_url?: string;
  owner_name: string;
  created_at: string;
  expires_at?: string;
}

export const createShare = async (data: ShareCreate): Promise<ShareResponse> => {
  const response = await apiClient.post('/shares/', data);
  return response.data;
};

export const getShares = async () => {
  const response = await apiClient.get('/shares/');
  return response.data;
};

export const getPublicShare = async (accessToken: string): Promise<ShareAccessResponse> => {
  const response = await apiClient.get(`/shares/public/${accessToken}`);
  return response.data;
};

export const updateShare = async (shareId: string, data: ShareUpdate): Promise<ShareResponse> => {
  const response = await apiClient.put(`/shares/${shareId}`, data);
  return response.data;
};

export const revokeShare = async (shareId: string) => {
  const response = await apiClient.delete(`/shares/${shareId}`);
  return response.data;
};
