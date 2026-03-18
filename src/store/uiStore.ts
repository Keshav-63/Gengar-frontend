import { create } from 'zustand';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

interface UIState {
  toasts: Toast[];
  sidebarOpen: boolean;
  showUploadModal: boolean;
  showCreateFolderModal: boolean;
  currentFolderId: string | null;

  addToast: (message: string, type: Toast['type'], duration?: number) => void;
  removeToast: (id: string) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setShowUploadModal: (show: boolean) => void;
  setShowCreateFolderModal: (show: boolean) => void;
  setCurrentFolderId: (folderId: string | null) => void;
}

export const useUIStore = create<UIState>((set) => ({
  toasts: [],
  sidebarOpen: true,
  showUploadModal: false,
  showCreateFolderModal: false,
  currentFolderId: null,

  addToast: (message, type, duration = 3000) => {
    const id = Math.random().toString(36).substr(2, 9);
    set((state) => ({
      toasts: [...state.toasts, { id, message, type, duration }],
    }));

    if (duration > 0) {
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }));
      }, duration);
    }
  },

  removeToast: (id) => set((state) => ({
    toasts: state.toasts.filter((t) => t.id !== id),
  })),

  toggleSidebar: () => set((state) => ({
    sidebarOpen: !state.sidebarOpen,
  })),

  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setShowUploadModal: (show) => set({ showUploadModal: show }),
  setShowCreateFolderModal: (show) => set({ showCreateFolderModal: show }),
  setCurrentFolderId: (folderId) => set({ currentFolderId: folderId }),
}));
