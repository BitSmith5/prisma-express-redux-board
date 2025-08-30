import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';
import type { NotificationType } from './NotificationBanner';
import NotificationBanner from './NotificationBanner';

interface SliceStatus {
  sliceName: string;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const ReduxStatusNotifications: React.FC = () => {
  // Get status and error from all slices
  const boardsStatus = useSelector((state: RootState) => ({
    sliceName: 'Boards',
    status: state.boards.status,
    error: state.boards.error
  }));
  
  const boardStatus = useSelector((state: RootState) => ({
    sliceName: 'Board',
    status: state.board.status,
    error: state.board.error
  }));
  
  const taskStatus = useSelector((state: RootState) => ({
    sliceName: 'Task',
    status: state.task.status,
    error: state.task.error
  }));

  const [notifications, setNotifications] = useState<Array<{
    id: string;
    sliceName: string;
    type: NotificationType;
    message: string;
    show: boolean;
  }>>([]);

  // Monitor all slice statuses
  useEffect(() => {
    const allSlices: SliceStatus[] = [boardsStatus, boardStatus, taskStatus];
    
    allSlices.forEach(slice => {
      if (slice.status === 'loading') {
        // Add loading notification only if one doesn't exist
        setNotifications(prev => {
          const existing = prev.find(n => n.sliceName === slice.sliceName && n.type === 'loading');
          if (existing) return prev;
          
          return [...prev, {
            id: `${slice.sliceName}-loading`,
            sliceName: slice.sliceName,
            type: 'loading',
            message: `Loading ${slice.sliceName.toLowerCase()}...`,
            show: true
          }];
        });
      } else if (slice.status === 'succeeded') {
        // Replace loading notification with success
        setNotifications(prev => {
          const filtered = prev.filter(n => !(n.sliceName === slice.sliceName));
          return [...filtered, {
            id: `${slice.sliceName}-success`,
            sliceName: slice.sliceName,
            type: 'success',
            message: `${slice.sliceName} operation completed successfully!`,
            show: true
          }];
        });
      } else if (slice.status === 'failed') {
        // Replace loading notification with error
        setNotifications(prev => {
          const filtered = prev.filter(n => !(n.sliceName === slice.sliceName));
          return [...filtered, {
            id: `${slice.sliceName}-error`,
            sliceName: slice.sliceName,
            type: 'error' as const,
            message: slice.error || 'An error occurred',
            show: true
          }];
        });
      } else if (slice.status === 'idle') {
        // Remove all notifications for this slice when idle
        setNotifications(prev => prev.filter(n => n.sliceName !== slice.sliceName));
      }
    });
  }, [boardsStatus, boardStatus, taskStatus]);

  // Auto-remove success notifications after 3 seconds
  useEffect(() => {
    const timers: number[] = [];
    
    notifications.forEach(notification => {
      if (notification.type === 'success') {
        const timer = setTimeout(() => {
          setNotifications(prev => prev.filter(n => n.id !== notification.id));
        }, 3000);
        timers.push(timer);
      }
    });
    
    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, [notifications]);

  // Clean up notifications when component unmounts
  useEffect(() => {
    return () => {
      setNotifications([]);
    };
  }, []);

  const handleClose = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  if (notifications.length === 0) return null;

  return (
    <>
      {notifications.map(notification => (
        <NotificationBanner
          key={notification.id}
          type={notification.type}
          message={notification.message}
          duration={notification.type === 'loading' ? 0 : 5000}
          show={notification.show}
          onClose={() => handleClose(notification.id)}
        />
      ))}
    </>
  );
};

export default ReduxStatusNotifications;
