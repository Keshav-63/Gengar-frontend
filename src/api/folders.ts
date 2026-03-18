import { apiClient } from './client';
import { Folder, FolderTreeNode } from '../types';

export interface FolderCreate {
  name: string;
  parent_folder_id?: string;
}

export interface FolderListParams {
  parent_folder_id?: string;
}

export interface FolderListResponse {
  folders: Folder[];
  total: number;
}

export interface FolderContentsResponse {
  folder: Folder;
  subfolders: Folder[];
  files: any[];
  total_items: number;
}

export interface FolderTreeResponse {
  tree: FolderTreeNode[];
}

export const createFolder = async (data: FolderCreate): Promise<Folder> => {
  const response = await apiClient.post('/folders/', data);
  return response.data;
};

export const getFolders = async (params?: FolderListParams): Promise<FolderListResponse> => {
  const response = await apiClient.get('/folders/', { params });
  return response.data;
};

export const getFolderContents = async (folderId: string): Promise<FolderContentsResponse> => {
  const response = await apiClient.get(`/folders/${folderId}`);
  return response.data;
};

export const getFolderTree = async (): Promise<FolderTreeResponse> => {
  const response = await apiClient.get('/folders/tree/all');
  return response.data;
};

export const renameFolder = async (folderId: string, newName: string) => {
  const response = await apiClient.put(`/folders/${folderId}/rename`, {
    new_name: newName,
  });
  return response.data;
};

export const deleteFolder = async (folderId: string) => {
  const response = await apiClient.delete(`/folders/${folderId}`);
  return response.data;
};
