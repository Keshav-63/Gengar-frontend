import React, { useRef } from 'react';
import { Upload, X } from 'lucide-react';
import { useFileStore } from '../../store/fileStore';
import { useUIStore } from '../../store/uiStore';
import { useFiles } from '../../hooks/useFiles';
import { ProgressBar } from '../common/ProgressBar';
import './FileUploader.css';

interface FileUploaderProps {
  folderId?: string;
  onUploadComplete?: () => void;
}

export const FileUploader = ({ folderId, onUploadComplete }: FileUploaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploads, addUpload, updateUpload, removeUpload } = useFileStore();
  const { uploadFile } = useFiles();
  const { addToast } = useUIStore();

  const handleFileSelect = async (files: FileList) => {
    if (files.length === 0) return;

    for (const file of Array.from(files)) {
      const uploadId = Math.random().toString(36).substr(2, 9);

      addUpload({
        id: uploadId,
        name: file.name,
        progress: 0,
        status: 'uploading',
      });

      try {
        const success = await uploadFile(file, folderId, (progress) => {
          updateUpload(uploadId, { progress });
        });

        if (!success) {
          throw new Error('Upload failed');
        }

        updateUpload(uploadId, { status: 'completed', progress: 100 });
        addToast(`${file.name} uploaded successfully`, 'success');
        
        if (onUploadComplete) {
          onUploadComplete();
        }

        setTimeout(() => removeUpload(uploadId), 3000);
      } catch (error) {
        updateUpload(uploadId, { status: 'error' });
        addToast(`Failed to upload ${file.name}`, 'error');
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('drag-over');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    handleFileSelect(e.dataTransfer.files);
  };

  return (
    <>
      <div
        className="file-uploader"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={(e) => handleFileSelect(e.currentTarget.files!)}
          style={{ display: 'none' }}
        />

        <div className="file-uploader-content" onClick={() => fileInputRef.current?.click()}>
          <div className="file-uploader-icon">
            <Upload size={48} />
          </div>
          <h3 className="file-uploader-title">Drag files here to upload</h3>
          <p className="file-uploader-subtitle">or click to select files</p>
        </div>
      </div>

      {uploads.length > 0 && (
        <div className="upload-progress-list">
          <h4 className="upload-progress-title">Uploads</h4>
          {uploads.map((upload) => (
            <div key={upload.id} className={`upload-progress-item upload-progress-${upload.status}`}>
              <div className="upload-progress-info">
                <p className="upload-progress-name">{upload.name}</p>
                <ProgressBar progress={upload.progress} showPercentage={true} />
              </div>
              {upload.status !== 'uploading' && (
                <button
                  className="upload-progress-close"
                  onClick={() => removeUpload(upload.id)}
                >
                  <X size={16} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
};
