import { formatStoragePercentage } from '../../utils/formatters';
import './StorageIndicator.css';

interface StorageIndicatorProps {
  used: number;
  limit: number;
}

export const StorageIndicator = ({ used, limit }: StorageIndicatorProps) => {
  const safeUsed = Math.max(0, used);
  const safeLimit = Math.max(1, limit);
  const percentage = formatStoragePercentage(safeUsed, safeLimit);
  const usedGB = (safeUsed / (1024 * 1024 * 1024)).toFixed(2);
  const limitGB = (safeLimit / (1024 * 1024 * 1024)).toFixed(0);
  const available = Math.max(0, safeLimit - safeUsed);

  const getStatusColor = (percent: number) => {
    if (percent >= 90) return 'critical';
    if (percent >= 70) return 'warning';
    return 'healthy';
  };

  const status = getStatusColor(percentage);

  return (
    <div className={`storage-indicator storage-indicator-${status}`}>
      <div className="storage-header">
        <h4 className="storage-title">Storage</h4>
        <span className="storage-percentage">{percentage}%</span>
      </div>

      <div className="storage-bar">
        <div className="storage-bar-fill" style={{ width: `${percentage}%` }}></div>
      </div>

      <div className="storage-details">
        <div className="storage-detail-item">
          <span className="storage-detail-label">Used</span>
          <span className="storage-detail-value">{usedGB} GB</span>
        </div>
        <div className="storage-detail-item">
          <span className="storage-detail-label">Available</span>
          <span className="storage-detail-value">
            {(available / (1024 * 1024 * 1024)).toFixed(2)} GB
          </span>
        </div>
        <div className="storage-detail-item">
          <span className="storage-detail-label">Total</span>
          <span className="storage-detail-value">{limitGB} GB</span>
        </div>
      </div>

      {status === 'critical' && (
        <div className="storage-alert">
          ⚠️ Storage is running out. Consider removing old files.
        </div>
      )}
      {status === 'warning' && (
        <div className="storage-alert">
          ℹ️ You've used {percentage}% of your storage.
        </div>
      )}
    </div>
  );
};
