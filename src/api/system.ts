import { apiClient } from './client';

export const getRoot = async () => {
  const response = await apiClient.get('/');
  return response.data;
};

export const getHealth = async () => {
  const response = await apiClient.get('/health');
  return response.data;
};
