import { useCallback, useState } from 'react';
import { useFileStore } from '../store/fileStore';
import * as filesAPI from '../api/files';

export const useFiles = () => {
  const { files, isLoading, error, setFiles, setLoading, setError, removeFile, updateFile } = useFileStore();
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);

  const fetchFiles = useCallback(async (folderId?: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await filesAPI.getFiles({
        folder_id: folderId,
        page: 1,
        page_size: 100,
      });
      setFiles(response.files);
      return response;
    } catch (err: any) {
      const message = err.response?.data?.detail || 'Failed to fetch files';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [setFiles, setLoading, setError]);

  const uploadFile = useCallback(async (file: globalThis.File, folderId?: string, onProgress?: (progress: number) => void) => {
    try {
      // Request upload URL
      const { file_id, upload_url } = await filesAPI.requestFileUpload({
        filename: file.name,
        size: file.size,
        mime_type: file.type,
        folder_id: folderId,
      });

      // Upload to S3
      await filesAPI.uploadFileToS3(upload_url, file, onProgress);

      // Complete upload
      await filesAPI.completeFileUpload(file_id);

      // Refresh files list
      await fetchFiles(folderId);

      return true;
    } catch (err: any) {
      const message = err.response?.data?.detail || err.message || 'Failed to upload file';
      setError(message);
      return false;
    }
  }, [fetchFiles, setError]);

  const deleteFileHandler = useCallback(async (fileId: string) => {
    try {
      await filesAPI.deleteFile(fileId);
      removeFile(fileId);
      return true;
    } catch (err: any) {
      const message = err.response?.data?.detail || 'Failed to delete file';
      setError(message);
      return false;
    }
  }, [removeFile, setError]);

  const renameFileHandler = useCallback(async (fileId: string, newName: string) => {
    try {
      await filesAPI.renameFile(fileId, newName);
      updateFile(fileId, { name: newName });
      return true;
    } catch (err: any) {
      const message = err.response?.data?.detail || 'Failed to rename file';
      setError(message);
      return false;
    }
  }, [updateFile, setError]);

  const moveFileHandler = useCallback(async (fileId: string, targetFolderId?: string) => {
    try {
      await filesAPI.moveFile(fileId, targetFolderId);
      removeFile(fileId);
      return true;
    } catch (err: any) {
      const message = err.response?.data?.detail || 'Failed to move file';
      setError(message);
      return false;
    }
  }, [removeFile, setError]);

  const getDownloadUrl = useCallback(async (fileId: string) => {
    try {
      const payload = await filesAPI.getFileDownloadUrl(fileId);
      if (!payload.download_url) {
        throw new Error('Download URL was not returned by server');
      }
      return payload;
    } catch (err: any) {
      const message = err.response?.data?.detail || 'Failed to get download URL';
      setError(message);
      return null;
    }
  }, [setError]);

  return {
    files,
    isLoading,
    error,
    currentFolderId,
    setCurrentFolderId,
    fetchFiles,
    uploadFile,
    deleteFile: deleteFileHandler,
    renameFile: renameFileHandler,
    moveFile: moveFileHandler,
    getDownloadUrl,
  };
};
