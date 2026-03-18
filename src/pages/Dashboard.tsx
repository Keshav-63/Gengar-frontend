import { useEffect, useCallback } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { FileUploader } from '../components/files/FileUploader';
import { FileList } from '../components/files/FileList';
import { StorageIndicator } from '../components/storage/StorageIndicator';
import { useFiles } from '../hooks/useFiles';
import { useAuth } from '../hooks/useAuth';
import { useUIStore } from '../store/uiStore';
import { File } from '../types';
import { createShare } from '../api/sharing';
import './Dashboard.css';

export const Dashboard = () => {
  const { user, storageInfo, fetchCurrentUser, fetchStorageInfo } = useAuth();
  const { files, isLoading, fetchFiles, deleteFile, getDownloadUrl } = useFiles();
  const { addToast, currentFolderId } = useUIStore();

  useEffect(() => {
    fetchCurrentUser();
    fetchStorageInfo();
    fetchFiles(currentFolderId || undefined);
  }, [fetchCurrentUser, fetchStorageInfo, fetchFiles, currentFolderId]);

  const storageUsed = Math.max(0, storageInfo?.storage_used ?? user?.storage_used ?? 0);
  const storageLimit = Math.max(0, storageInfo?.storage_limit ?? user?.storage_limit ?? 0);

  const handleDownload = useCallback(
    async (file: File) => {
      try {
        const downloadInfo = await getDownloadUrl(file.id);
        if (downloadInfo?.download_url) {
          try {
            const response = await fetch(downloadInfo.download_url, { method: 'GET' });

            if (!response.ok) {
              const text = await response.text();
              if (text.includes('InvalidAccessKeyId')) {
                addToast('Download link is invalid. Backend storage credentials are misconfigured.', 'error');
                return;
              }

              addToast(`Download failed for ${file.name}`, 'error');
              return;
            }

            const blob = await response.blob();
            const objectUrl = URL.createObjectURL(blob);
            const anchor = document.createElement('a');
            anchor.href = objectUrl;
            anchor.download = downloadInfo.filename || file.name;
            document.body.appendChild(anchor);
            anchor.click();
            anchor.remove();
            URL.revokeObjectURL(objectUrl);
            addToast(`Downloading ${file.name}`, 'success');
            return;
          } catch {
            window.open(downloadInfo.download_url, '_blank', 'noopener,noreferrer');
            addToast(`Opened ${file.name}`, 'info');
            return;
          }
        }
      } catch (error) {
        addToast(`Failed to download ${file.name}`, 'error');
      }
    },
    [getDownloadUrl, addToast]
  );

  const handleShare = useCallback(
    async (file: File) => {
      try {
        const share = await createShare({
          resource_type: 'file',
          resource_id: file.id,
          permission: 'view',
          expires_in_days: 7,
        });

        await navigator.clipboard.writeText(share.share_url);
        addToast(`Share link copied for ${file.name}`, 'success');
      } catch {
        addToast(`Failed to share ${file.name}`, 'error');
      }
    },
    [addToast]
  );

  const handleDelete = useCallback(
    async (file: File) => {
      if (confirm(`Are you sure you want to delete ${file.name}?`)) {
        const success = await deleteFile(file.id);
        if (success) {
          addToast(`${file.name} deleted successfully`, 'success');
          fetchFiles(currentFolderId || undefined);
        } else {
          addToast(`Failed to delete ${file.name}`, 'error');
        }
      }
    },
    [deleteFile, addToast, fetchFiles, currentFolderId]
  );

  return (
    <DashboardLayout>
      <div className="dashboard-page">
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">My Files</h1>
            <p className="dashboard-subtitle">Manage and organize your cloud files</p>
          </div>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-main">
            <FileUploader
              folderId={currentFolderId || undefined}
              onUploadComplete={() => fetchFiles(currentFolderId || undefined)}
            />

            <div className="dashboard-files-section">
              <h2 className="dashboard-section-title">Recent Files</h2>
              <FileList
                files={files}
                isLoading={isLoading}
                onDownload={handleDownload}
                onDelete={handleDelete}
                onShare={handleShare}
                onFileClick={handleDownload}
              />
            </div>
          </div>

          <aside className="dashboard-sidebar">
            {(storageInfo || user) && (
              <StorageIndicator
                used={storageUsed}
                limit={storageLimit}
              />
            )}
          </aside>
        </div>
      </div>
    </DashboardLayout>
  );
};
