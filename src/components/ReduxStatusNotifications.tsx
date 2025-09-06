import React, { useEffect, useState, useMemo, useCallback } from 'react';
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
  // Get status and error from all slices with equality functions to prevent unnecessary re-renders
  const boardsStatus = useSelector((state: RootState) => ({
    sliceName: 'Boards',
    status: state.boards.status,
    error: state.boards.error
  }), (prev, next) => 
    prev.status === next.status && prev.error === next.error
  );
  
  const boardStatus = useSelector((state: RootState) => ({
    sliceName: 'Board',
    status: state.board.status,
    error: state.board.error
  }), (prev, next) => 
    prev.status === next.status && prev.error === next.error
  );
  
  const taskStatus = useSelector((state: RootState) => ({
    sliceName: 'Task',
    status: state.task.status,
    error: state.task.error
  }), (prev, next) => 
    prev.status === next.status && prev.error === next.error
  );

  const [notifications, setNotifications] = useState<Array<{
    id: string;
    sliceName: string;
    type: NotificationType;
    message: string;
    show: boolean;
  }>>([]);

  // Memoize the allSlices array to prevent unnecessary re-creation
  const allSlices = useMemo(() => [boardsStatus, boardStatus, taskStatus], [
    boardsStatus.status, boardsStatus.error,
    boardStatus.status, boardStatus.error,
    taskStatus.status, taskStatus.error
  ]);

  // Memoize the notification update logic
  const updateNotifications = useCallback((slice: SliceStatus) => {
    if (slice.status === 'loading') {
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
      setNotifications(prev => prev.filter(n => n.sliceName !== slice.sliceName));
    }
  }, []);

  // Monitor all slice statuses with memoized dependencies
  useEffect(() => {
    allSlices.forEach(updateNotifications);
  }, [allSlices, updateNotifications]);

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

  const handleClose = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

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
