import { apiClient } from './client';
import { File as CloudFile } from '../types';

export interface FileUploadRequest {
  filename: string;
  size: number;
  mime_type: string;
  folder_id?: string;
}

export interface FileUploadResponse {
  file_id: string;
  upload_url: string;
  expires_in: number;
}

export interface FileListParams {
  folder_id?: string;
  page?: number;
  page_size?: number;
}

export interface FileListResponse {
  files: CloudFile[];
  total: number;
  page: number;
  page_size: number;
  has_more: boolean;
}

export interface FileDownloadResponse {
  download_url: string;
  filename?: string;
  expires_in?: number;
}

export const requestFileUpload = async (data: FileUploadRequest): Promise<FileUploadResponse> => {
  const response = await apiClient.post('/files/upload', data);
  return response.data;
};

export const completeFileUpload = async (fileId: string) => {
  const response = await apiClient.post('/files/upload/complete', {
    file_id: fileId,
  });
  return response.data;
};

export const getFiles = async (params?: FileListParams): Promise<FileListResponse> => {
  const response = await apiClient.get('/files/', { params });
  return response.data;
};

export const getFile = async (fileId: string): Promise<CloudFile> => {
  const response = await apiClient.get(`/files/${fileId}`);
  return response.data;
};

export const getFileDownloadUrl = async (fileId: string): Promise<FileDownloadResponse> => {
  const response = await apiClient.get(`/files/${fileId}/download`);
  const payload = response.data;
  return {
    download_url: payload?.download_url || payload?.downloadUrl || payload?.url || '',
    filename: payload?.filename || payload?.file_name,
    expires_in: payload?.expires_in || payload?.expiresIn,
  };
};

export const deleteFile = async (fileId: string) => {
  const response = await apiClient.delete(`/files/${fileId}`);
  return response.data;
};

export const moveFile = async (fileId: string, targetFolderId?: string) => {
  const response = await apiClient.put(`/files/${fileId}/move`, {
    target_folder_id: targetFolderId,
  });
  return response.data;
};

export const renameFile = async (fileId: string, newName: string) => {
  const response = await apiClient.put(`/files/${fileId}/rename`, {
    new_name: newName,
  });
  return response.data;
};

export const getCompressionStatus = async (fileId: string) => {
  const response = await apiClient.get(`/files/${fileId}/compression-status`);
  return response.data;
};

export const uploadFileToS3 = async (
  uploadUrl: string,
  file: globalThis.File,
  onProgress?: (progress: number) => void,
  maxRetries = 2
) => {
  const attemptUpload = (attempt: number): Promise<void> =>
    new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      if (onProgress) {
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            const progress = (e.loaded / e.total) * 100;
            onProgress(Math.min(progress, 99));
          }
        });
      }

      xhr.addEventListener('load', () => {
        if (xhr.status === 200 || xhr.status === 201 || xhr.status === 204) {
          onProgress?.(100);
          resolve();
          return;
        }

        const statusError = new Error(`S3 upload failed with status ${xhr.status}`);
        if (attempt < maxRetries) {
          const delay = 500 * Math.pow(2, attempt);
          setTimeout(() => {
            attemptUpload(attempt + 1).then(resolve).catch(reject);
          }, delay);
          return;
        }

        reject(statusError);
      });

      xhr.addEventListener('error', () => {
        if (attempt < maxRetries) {
          const delay = 500 * Math.pow(2, attempt);
          setTimeout(() => {
            attemptUpload(attempt + 1).then(resolve).catch(reject);
          }, delay);
          return;
        }

        reject(new Error('S3 upload failed due to network error'));
      });

      xhr.open('PUT', uploadUrl);
      xhr.timeout = 600000;
      xhr.setRequestHeader('Content-Type', file.type || 'application/octet-stream');
      xhr.send(file);
    });

  return attemptUpload(0);
};
