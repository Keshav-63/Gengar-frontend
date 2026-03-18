import { apiClient } from './client';
import { User, TokenResponse } from '../types';
import { clearStoredAuth } from '../utils/authStorage';

const normalizeTokenResponse = (payload: any): TokenResponse => {
  const accessToken = payload?.access_token || payload?.accessToken || payload?.token || payload?.jwt;
  if (!accessToken) {
    throw new Error('Auth response did not include an access token');
  }

  return {
    access_token: accessToken,
    refresh_token: payload?.refresh_token || payload?.refreshToken || '',
    token_type: payload?.token_type || payload?.tokenType || 'bearer',
  };
};

export interface RegisterRequest {
  email: string;
  password: string;
  full_name: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export const register = async (data: RegisterRequest): Promise<TokenResponse> => {
  const response = await apiClient.post('/auth/register', data);
  return normalizeTokenResponse(response.data);
};

export const login = async (credentials: LoginRequest): Promise<TokenResponse> => {
  const response = await apiClient.post('/auth/login', credentials);
  return normalizeTokenResponse(response.data);
};

export const getCurrentUser = async (): Promise<User> => {
  const response = await apiClient.get('/auth/me');
  return response.data;
};

export const getStorageInfo = async () => {
  const response = await apiClient.get('/auth/storage');
  return response.data;
};

export const changePassword = async (currentPassword: string, newPassword: string) => {
  const response = await apiClient.put('/auth/password', {
    current_password: currentPassword,
    new_password: newPassword,
  });
  return response.data;
};

export const logout = () => {
  clearStoredAuth();
  window.location.href = '/login';
};
