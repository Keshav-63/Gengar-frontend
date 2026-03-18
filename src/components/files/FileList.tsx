import React, { useCallback, useMemo } from 'react';
import { File } from '../../types';
import { FileItem } from './FileItem';
import { EmptyState } from '../common/EmptyState';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { FileIcon } from 'lucide-react';
import './FileList.css';

interface FileListProps {
  files: File[];
  isLoading?: boolean;
  onDownload?: (file: File) => void;
  onDelete?: (file: File) => void;
  onShare?: (file: File) => void;
  onFileClick?: (file: File) => void;
  selectedFileId?: string | null;
}

export const FileList = React.memo(
  ({
    files,
    isLoading = false,
    onDownload,
    onDelete,
    onShare,
    onFileClick,
    selectedFileId,
  }: FileListProps) => {
    const sortedFiles = useMemo(() => {
      return [...files].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    }, [files]);

    const handleFileClick = useCallback(
      (file: File) => {
        onFileClick?.(file);
      },
      [onFileClick]
    );

    if (isLoading) {
      return <LoadingSpinner text="Loading files..." />;
    }

    if (files.length === 0) {
      return (
        <EmptyState
          icon={<FileIcon size={32} />}
          title="No files yet"
          description="Upload files or create folders to get started"
        />
      );
    }

    return (
      <div className="file-list">
        {sortedFiles.map((file) => (
          <FileItem
            key={file.id}
            file={file}
            onDownload={onDownload}
            onDelete={onDelete}
            onShare={onShare}
            onClick={handleFileClick}
            isSelected={selectedFileId === file.id}
          />
        ))}
      </div>
    );
  }
);

FileList.displayName = 'FileList';
