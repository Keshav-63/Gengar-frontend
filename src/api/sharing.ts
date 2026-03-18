import { apiClient } from './client';
import { ShareAccessResponse, ShareListResponse, ShareResponse } from '../types';

export interface ShareCreate {
  resource_type: 'file' | 'folder';
  resource_id: string;
  permission: 'view' | 'download' | 'edit';
  is_public?: boolean;
  shared_with_user_email?: string;
  expires_in_days?: number;
  password?: string;
}

export interface ShareUpdate {
  permission?: 'view' | 'download' | 'edit';
  expires_in_days?: number;
  is_active?: boolean;
}

export const createShare = async (data: ShareCreate): Promise<ShareResponse> => {
  const response = await apiClient.post('/shares/', data);
  return response.data;
};

export const getShares = async (): Promise<ShareListResponse> => {
  const response = await apiClient.get('/shares/');
  return response.data;
};

export const getPublicShare = async (accessToken: string): Promise<ShareAccessResponse> => {
  const response = await apiClient.get(`/shares/public/${accessToken}`);
  return response.data;
};

export const getShareById = async (shareId: string): Promise<ShareResponse> => {
  const response = await apiClient.get(`/shares/${shareId}`);
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
