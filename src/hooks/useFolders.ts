import { useCallback, useState } from 'react';
import * as foldersAPI from '../api/folders';
import { Folder, FolderTreeNode } from '../types';

export const useFolders = () => {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [folderTree, setFolderTree] = useState<FolderTreeNode[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFolders = useCallback(async (parentFolderId?: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await foldersAPI.getFolders({
        parent_folder_id: parentFolderId,
      });
      setFolders(Array.isArray(response?.folders) ? response.folders : []);
      return response;
    } catch (err: any) {
      const message = err.response?.data?.detail || 'Failed to fetch folders';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchFolderTree = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await foldersAPI.getFolderTree();
      const normalizedTree = Array.isArray(response?.tree)
        ? response.tree
        : Array.isArray(response)
          ? (response as FolderTreeNode[])
          : [];
      setFolderTree(normalizedTree);
      return normalizedTree;
    } catch (err: any) {
      const message = err.response?.data?.detail || 'Failed to fetch folder tree';
      setError(message);
      setFolderTree([]);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createFolder = useCallback(async (name: string, parentFolderId?: string) => {
    try {
      const folder = await foldersAPI.createFolder({
        name,
        parent_folder_id: parentFolderId,
      });
      setFolders((prev) => [folder, ...prev]);
      return folder;
    } catch (err: any) {
      const message = err.response?.data?.detail || 'Failed to create folder';
      setError(message);
      return null;
    }
  }, []);

  const renameFolder = useCallback(async (folderId: string, newName: string) => {
    try {
      await foldersAPI.renameFolder(folderId, newName);
      setFolders((prev) =>
        prev.map((f) => (f.id === folderId ? { ...f, name: newName } : f))
      );
      return true;
    } catch (err: any) {
      const message = err.response?.data?.detail || 'Failed to rename folder';
      setError(message);
      return false;
    }
  }, []);

  const deleteFolder = useCallback(async (folderId: string) => {
    try {
      await foldersAPI.deleteFolder(folderId);
      setFolders((prev) => prev.filter((f) => f.id !== folderId));
      return true;
    } catch (err: any) {
      const message = err.response?.data?.detail || 'Failed to delete folder';
      setError(message);
      return false;
    }
  }, []);

  return {
    folders,
    folderTree,
    isLoading,
    error,
    fetchFolders,
    fetchFolderTree,
    createFolder,
    renameFolder,
    deleteFolder,
  };
};
