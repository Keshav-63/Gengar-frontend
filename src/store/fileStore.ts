import { create } from 'zustand';
import { File, Upload } from '../types';

interface FileState {
  files: File[];
  uploads: Upload[];
  selectedFileId: string | null;
  viewMode: 'list' | 'grid';
  isLoading: boolean;
  error: string | null;
  
  setFiles: (files: File[]) => void;
  addFile: (file: File) => void;
  removeFile: (fileId: string) => void;
  updateFile: (fileId: string, file: Partial<File>) => void;
  
  addUpload: (upload: Upload) => void;
  updateUpload: (uploadId: string, upload: Partial<Upload>) => void;
  removeUpload: (uploadId: string) => void;
  
  setSelectedFileId: (fileId: string | null) => void;
  setViewMode: (mode: 'list' | 'grid') => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  clearFiles: () => void;
}

export const useFileStore = create<FileState>((set) => ({
  files: [],
  uploads: [],
  selectedFileId: null,
  viewMode: 'list',
  isLoading: false,
  error: null,

  setFiles: (files) => set({ files }),
  
  addFile: (file) => set((state) => ({
    files: [file, ...state.files],
  })),

  removeFile: (fileId) => set((state) => ({
    files: state.files.filter((f) => f.id !== fileId),
  })),

  updateFile: (fileId, updates) => set((state) => ({
    files: state.files.map((f) => 
      f.id === fileId ? { ...f, ...updates } : f
    ),
  })),

  addUpload: (upload) => set((state) => ({
    uploads: [...state.uploads, upload],
  })),

  updateUpload: (uploadId, updates) => set((state) => ({
    uploads: state.uploads.map((u) =>
      u.id === uploadId ? { ...u, ...updates } : u
    ),
  })),

  removeUpload: (uploadId) => set((state) => ({
    uploads: state.uploads.filter((u) => u.id !== uploadId),
  })),

  setSelectedFileId: (fileId) => set({ selectedFileId: fileId }),
  setViewMode: (mode) => set({ viewMode: mode }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  
  clearFiles: () => set({ files: [], uploads: [], selectedFileId: null }),
}));
