import './ProgressBar.css';

interface ProgressBarProps {
  progress: number;
  label?: string;
  showPercentage?: boolean;
}

export const ProgressBar = ({ progress, label, showPercentage = true }: ProgressBarProps) => {
  const percentage = Math.min(Math.max(progress, 0), 100);

  return (
    <div className="progress-bar-wrapper">
      {(label || showPercentage) && (
        <div className="progress-bar-header">
          {label && <span className="progress-bar-label">{label}</span>}
          {showPercentage && <span className="progress-bar-percentage">{Math.round(percentage)}%</span>}
        </div>
      )}
      <div className="progress-bar">
        <div className="progress-bar-fill" style={{ width: `${percentage}%` }}></div>
      </div>
    </div>
  );
};
