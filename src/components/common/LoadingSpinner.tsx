import React from 'react';
import './LoadingSpinner.css';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

export const LoadingSpinner = ({ size = 'md', text }: LoadingSpinnerProps) => {
  return (
    <div className="loading-spinner-wrapper">
      <div className={`loading-spinner loading-spinner-${size}`}></div>
      {text && <p className="loading-spinner-text">{text}</p>}
    </div>
  );
};
