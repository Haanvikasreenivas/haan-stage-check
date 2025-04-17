
import { useCallback } from 'react';
import { toast } from 'sonner';
import { useAnimations } from '@/contexts/AnimationContext';

type NotificationType = 'success' | 'info' | 'warning' | 'error';

export const useNotification = () => {
  const { animationsEnabled } = useAnimations();

  const showNotification = useCallback((
    message: string, 
    type: NotificationType = 'success', 
    duration: number = animationsEnabled ? 2000 : 3000
  ) => {
    // Map our notification types to sonner methods
    switch (type) {
      case 'success':
        toast.success(message, { duration });
        break;
      case 'info':
        toast.info(message, { duration });
        break;
      case 'warning':
        toast.warning(message, { duration });
        break;
      case 'error':
        toast.error(message, { duration });
        break;
      default:
        toast(message, { duration });
    }
    
    return message; // Return message for potential chaining
  }, [animationsEnabled]);

  return { showNotification };
};
