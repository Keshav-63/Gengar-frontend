import { useCallback, useEffect } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { FileUploader } from '../components/files/FileUploader';
import { FileList } from '../components/files/FileList';
import { useFiles } from '../hooks/useFiles';
import { useUIStore } from '../store/uiStore';
import { File } from '../types';
import { createShare } from '../api/sharing';
import './Files.css';

export const Files = () => {
  const { files, isLoading, fetchFiles, deleteFile, getDownloadUrl } = useFiles();
  const { addToast, currentFolderId } = useUIStore();

  useEffect(() => {
    fetchFiles(currentFolderId || undefined);
  }, [fetchFiles, currentFolderId]);

  const handleDownload = useCallback(
    async (file: File) => {
      const downloadInfo = await getDownloadUrl(file.id);
      if (!downloadInfo?.download_url) {
        addToast(`Failed to get download for ${file.name}`, 'error');
        return;
      }

      window.open(downloadInfo.download_url, '_blank', 'noopener,noreferrer');
      addToast(`Opened ${file.name}`, 'info');
    },
    [getDownloadUrl, addToast]
  );

  const handleDelete = useCallback(
    async (file: File) => {
      if (!confirm(`Delete ${file.name}?`)) {
        return;
      }

      const success = await deleteFile(file.id);
      if (!success) {
        addToast(`Failed to delete ${file.name}`, 'error');
        return;
      }

      addToast(`${file.name} deleted`, 'success');
    },
    [deleteFile, addToast]
  );

  const handleShare = useCallback(
    async (file: File) => {
      const share = await createShare({
        resource_type: 'file',
        resource_id: file.id,
        permission: 'view',
      });

      if (!share?.share_url) {
        addToast(`Failed to create share for ${file.name}`, 'error');
        return;
      }

      await navigator.clipboard.writeText(share.share_url);
      addToast(`Share link copied for ${file.name}`, 'success');
    },
    [addToast]
  );

  return (
    <DashboardLayout>
      <section className="files-page">
        <header className="files-header">
          <h1 className="files-title">All Files</h1>
          <p className="files-subtitle">Upload, open, share, and delete files from here.</p>
        </header>

        <FileUploader
          folderId={currentFolderId || undefined}
          onUploadComplete={() => fetchFiles(currentFolderId || undefined)}
        />

        <FileList
          files={files}
          isLoading={isLoading}
          onDownload={handleDownload}
          onDelete={handleDelete}
          onShare={handleShare}
          onFileClick={handleDownload}
        />
      </section>
    </DashboardLayout>
  );
};
