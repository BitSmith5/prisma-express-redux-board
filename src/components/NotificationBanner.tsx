import React, { useState, useEffect, useCallback } from 'react';

export type NotificationType = 'loading' | 'success' | 'error' | 'warning' | 'info';

export interface NotificationBannerProps {
  type: NotificationType;
  message: string;
  duration?: number; // Auto-dismiss duration in milliseconds, 0 to disable
  onClose?: () => void;
  show?: boolean;
  className?: string;
}

const NotificationBanner: React.FC<NotificationBannerProps> = ({
  type,
  message,
  duration = 5000, // Default 5 seconds
  onClose,
  show = true,
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(show);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsVisible(show);
    if (show) {
      setIsAnimating(true);
    }
  }, [show]);

  const handleClose = useCallback(() => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, 300); // Wait for animation to complete
  }, [onClose]);

  useEffect(() => {
    if (duration > 0 && isVisible && type !== 'loading') {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, isVisible, type, handleClose]);

  if (!isVisible) return null;

  const getTypeStyles = () => {
    switch (type) {
      case 'loading':
        return {
          bgColor: 'var(--bg-tertiary)',
          borderColor: 'var(--accent-primary)',
          icon: '⏳',
          textColor: 'var(--text-primary)',
        };
      case 'success':
        return {
          bgColor: 'rgba(16, 185, 129, 0.1)',
          borderColor: 'var(--accent-success)',
          icon: '✅',
          textColor: 'var(--accent-success)',
        };
      case 'error':
        return {
          bgColor: 'rgba(239, 68, 68, 0.1)',
          borderColor: 'var(--accent-danger)',
          icon: '❌',
          textColor: 'var(--accent-danger)',
        };
      case 'warning':
        return {
          bgColor: 'rgba(245, 158, 11, 0.1)',
          borderColor: 'var(--accent-warning)',
          icon: '⚠️',
          textColor: 'var(--accent-warning)',
        };
      case 'info':
        return {
          bgColor: 'rgba(59, 130, 246, 0.1)',
          borderColor: 'var(--accent-primary)',
          icon: 'ℹ️',
          textColor: 'var(--accent-primary)',
        };
      default:
        return {
          bgColor: 'var(--bg-card)',
          borderColor: 'var(--border-color)',
          icon: '💬',
          textColor: 'var(--text-primary)',
        };
    }
  };

  const typeStyles = getTypeStyles();

  return (
    <div
      className={`notification-banner ${className} ${isAnimating ? 'slide-in' : 'slide-out'}`}
      style={{
        backgroundColor: typeStyles.bgColor,
        borderColor: typeStyles.borderColor,
        color: typeStyles.textColor,
      }}
    >
      <div className="notification-content">
        <span className="notification-icon">{typeStyles.icon}</span>
        <span className="notification-message">{message}</span>
        {type === 'loading' && (
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
        )}
      </div>
      <button
        className="notification-close"
        onClick={handleClose}
        aria-label="Close notification"
      >
        ✕
      </button>
    </div>
  );
};

export default NotificationBanner;
