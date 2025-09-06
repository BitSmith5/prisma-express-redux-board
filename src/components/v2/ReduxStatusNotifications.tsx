import React, { useEffect, useState, useCallback } from 'react';
import { 
  useGetBoardsQuery, 
  useGetBoardQuery, 
  useCreateBoardMutation,
  useUpdateBoardMutation,
  useDeleteBoardMutation,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation
} from '../../store/v2/api/boardApi';
import type { NotificationType } from '../NotificationBanner';
import NotificationBanner from '../NotificationBanner';

interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  show: boolean;
}

const ReduxStatusNotifications: React.FC = () => {
  // Use RTK Query hooks to monitor API state
  const { isLoading: boardsLoading, error: boardsError } = useGetBoardsQuery();
  
  // Monitor mutations (these don't have built-in loading states)
  const [, { isLoading: createBoardLoading, error: createBoardError }] = useCreateBoardMutation();
  const [, { isLoading: updateBoardLoading, error: updateBoardError }] = useUpdateBoardMutation();
  const [, { isLoading: deleteBoardLoading, error: deleteBoardError }] = useDeleteBoardMutation();
  const [, { isLoading: createTaskLoading, error: createTaskError }] = useCreateTaskMutation();
  const [, { isLoading: updateTaskLoading, error: updateTaskError }] = useUpdateTaskMutation();
  const [, { isLoading: deleteTaskLoading, error: deleteTaskError }] = useDeleteTaskMutation();

  const [currentNotification, setCurrentNotification] = useState<Notification | null>(null);
  const [notificationQueue, setNotificationQueue] = useState<Notification[]>([]);

  // Function to add notification to queue
  const addNotification = (notification: Notification) => {
    setNotificationQueue(prev => {
      // Check if notification already exists in queue
      const exists = prev.find(n => n.id === notification.id);
      if (exists) return prev;
      
      return [...prev, notification];
    });
  };

  // Function to remove notification from queue
  const removeNotification = (id: string) => {
    setNotificationQueue(prev => prev.filter(n => n.id !== id));
  };

  // Monitor loading states and show notifications
  useEffect(() => {
    const loadingStates = [
      { loading: boardsLoading, name: 'Boards' },
      { loading: createBoardLoading, name: 'Create Board' },
      { loading: updateBoardLoading, name: 'Update Board' },
      { loading: deleteBoardLoading, name: 'Delete Board' },
      { loading: createTaskLoading, name: 'Create Task' },
      { loading: updateTaskLoading, name: 'Update Task' },
      { loading: deleteTaskLoading, name: 'Delete Task' },
    ];

    // Handle loading states
    loadingStates.forEach(({ loading, name }) => {
      if (loading) {
        addNotification({
          id: `${name.toLowerCase()}-loading`,
          type: 'loading',
          message: `Loading ${name.toLowerCase()}...`,
          show: true
        });
      } else {
        // When loading finishes, show success notification briefly
        removeNotification(`${name.toLowerCase()}-loading`);
        addNotification({
          id: `${name.toLowerCase()}-success`,
          type: 'success',
          message: `${name} loaded successfully`,
          show: true
        });
      }
    });
  }, [
    boardsLoading, createBoardLoading, updateBoardLoading, 
    deleteBoardLoading, createTaskLoading, updateTaskLoading, deleteTaskLoading
  ]);

  // Monitor error states and show notifications
  useEffect(() => {
    const errorStates = [
      { error: boardsError, name: 'Boards' },
      { error: createBoardError, name: 'Create Board' },
      { error: updateBoardError, name: 'Update Board' },
      { error: deleteBoardError, name: 'Delete Board' },
      { error: createTaskError, name: 'Create Task' },
      { error: updateTaskError, name: 'Update Task' },
      { error: deleteTaskError, name: 'Delete Task' },
    ];

    errorStates.forEach(({ error, name }) => {
      if (error) {
        addNotification({
          id: `${name.toLowerCase()}-error`,
          type: 'error',
          message: `Error: ${name} operation failed`,
          show: true
        });
      } else {
        removeNotification(`${name.toLowerCase()}-error`);
      }
    });
  }, [
    boardsError, createBoardError, updateBoardError,
    deleteBoardError, createTaskError, updateTaskError, deleteTaskError
  ]);

  // Queue management - show one notification at a time
  useEffect(() => {
    if (notificationQueue.length > 0 && !currentNotification) {
      // Show the first notification in the queue
      setCurrentNotification(notificationQueue[0]);
      setNotificationQueue(prev => prev.slice(1));
    }
  }, [notificationQueue, currentNotification]);

  // Auto-remove success notifications after 3 seconds
  useEffect(() => {
    if (currentNotification && currentNotification.type === 'success') {
      const timer = setTimeout(() => {
        setCurrentNotification(null);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [currentNotification]);

  // Clean up notifications when component unmounts
  useEffect(() => {
    return () => {
      setCurrentNotification(null);
      setNotificationQueue([]);
    };
  }, []);

  const handleClose = useCallback((id: string) => {
    setCurrentNotification(null);
  }, []);

  if (!currentNotification) return null;

  return (
    <NotificationBanner
      key={currentNotification.id}
      type={currentNotification.type}
      message={currentNotification.message}
      duration={currentNotification.type === 'loading' ? 0 : 5000}
      show={currentNotification.show}
      onClose={() => handleClose(currentNotification.id)}
    />
  );
};

export default ReduxStatusNotifications;
