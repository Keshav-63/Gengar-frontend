import { apiClient } from './client';
import { StorageInfo, User, UserUpdate, TokenResponse } from '../types';
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

export interface TokenRefreshRequest {
  refresh_token: string;
}

export interface TokenRefreshResponse {
  access_token: string;
  token_type: string;
  refresh_token?: string;
}

export interface PasswordChangeRequest {
  current_password: string;
  new_password: string;
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
  return response.data as StorageInfo;
};

export const changePassword = async (currentPassword: string, newPassword: string) => {
  const response = await apiClient.put('/auth/password', {
    current_password: currentPassword,
    new_password: newPassword,
  });
  return response.data;
};

export const refreshToken = async (data: TokenRefreshRequest): Promise<TokenRefreshResponse> => {
  const response = await apiClient.post('/auth/refresh', data);
  const payload = response.data;
  return {
    access_token: payload?.access_token || payload?.accessToken || payload?.token || '',
    token_type: payload?.token_type || payload?.tokenType || 'bearer',
    refresh_token: payload?.refresh_token || payload?.refreshToken,
  };
};

export const updateCurrentUser = async (data: UserUpdate): Promise<User> => {
  const response = await apiClient.put('/auth/me', data);
  return response.data;
};

export const changePasswordByPayload = async (data: PasswordChangeRequest) => {
  const response = await apiClient.put('/auth/password', data);
  return response.data;
};

export const logout = () => {
  clearStoredAuth();
  window.location.href = '/login';
};
