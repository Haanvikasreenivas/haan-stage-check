
import { useState, useCallback } from 'react';
import NotificationToast from '@/components/Notifications/NotificationToast';

type NotificationType = 'success' | 'info' | 'warning' | 'error';

interface Notification {
  id: string;
  message: string;
  type: NotificationType;
  duration: number;
}

export const useNotification = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const showNotification = useCallback((
    message: string, 
    type: NotificationType = 'success', 
    duration: number = 2000
  ) => {
    const id = Math.random().toString(36).substring(2, 9);
    
    setNotifications(prev => [
      ...prev,
      {
        id,
        message,
        type,
        duration,
      }
    ]);
    
    return id;
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const NotificationContainer = () => {
    return (
      <>
        {notifications.map(notification => (
          <NotificationToast
            key={notification.id}
            message={notification.message}
            duration={notification.duration}
            type={notification.type}
            onClose={() => removeNotification(notification.id)}
          />
        ))}
      </>
    );
  };

  return {
    showNotification,
    removeNotification,
    NotificationContainer,
  };
};
