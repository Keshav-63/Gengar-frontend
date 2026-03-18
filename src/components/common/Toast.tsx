import { Check, AlertCircle, Info, X as XIcon } from 'lucide-react';
import { useUIStore } from '../../store/uiStore';
import './Toast.css';

export const Toast = () => {
  const { toasts, removeToast } = useUIStore();

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <Check size={20} />;
      case 'error':
        return <AlertCircle size={20} />;
      case 'info':
        return <Info size={20} />;
      case 'warning':
        return <AlertCircle size={20} />;
      default:
        return null;
    }
  };

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast-${toast.type}`}>
          <div className="toast-icon">{getIcon(toast.type)}</div>
          <div className="toast-message">{toast.message}</div>
          <button className="toast-close" onClick={() => removeToast(toast.id)}>
            <XIcon size={16} />
          </button>
        </div>
      ))}
    </div>
  );
};
