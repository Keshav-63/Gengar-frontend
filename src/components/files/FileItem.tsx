import React, { memo } from 'react';
import { FileIcon, Download, Trash2, Share2, MoreVertical } from 'lucide-react';
import { File } from '../../types';
import { formatFileSize, formatDate } from '../../utils/formatters';
import './FileItem.css';

interface FileItemProps {
  file: File;
  onDownload?: (file: File) => void;
  onDelete?: (file: File) => void;
  onShare?: (file: File) => void;
  isSelected?: boolean;
  onClick?: (file: File) => void;
}

export const FileItem = memo(
  ({ file, onDownload, onDelete, onShare, isSelected, onClick }: FileItemProps) => {
    return (
      <div
        className={`file-item ${isSelected ? 'selected' : ''}`}
        onClick={() => onClick?.(file)}
      >
        <div className="file-item-main">
          <div className="file-item-icon">
            <FileIcon size={24} />
          </div>
          <div className="file-item-info">
            <h4 className="file-item-name">{file.name}</h4>
            <p className="file-item-meta">
              {formatFileSize(file.file_size)} • {formatDate(file.created_at)}
            </p>
          </div>
        </div>

        <div className="file-item-actions">
          {onShare && (
            <button
              className="file-item-action-btn"
              onClick={(e) => {
                e.stopPropagation();
                onShare(file);
              }}
              title="Share"
            >
              <Share2 size={18} />
            </button>
          )}
          {onDownload && (
            <button
              className="file-item-action-btn"
              onClick={(e) => {
                e.stopPropagation();
                onDownload(file);
              }}
              title="Download"
            >
              <Download size={18} />
            </button>
          )}
          {onDelete && (
            <button
              className="file-item-action-btn file-item-action-danger"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(file);
              }}
              title="Delete"
            >
              <Trash2 size={18} />
            </button>
          )}
          <button className="file-item-action-btn" title="More options">
            <MoreVertical size={18} />
          </button>
        </div>
      </div>
    );
  }
);

FileItem.displayName = 'FileItem';
