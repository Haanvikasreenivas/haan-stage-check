
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Info, AlertCircle, X } from 'lucide-react';
import { useAnimations } from '@/contexts/AnimationContext';

interface NotificationToastProps {
  message: string;
  duration?: number;
  onClose: () => void;
  type?: 'success' | 'info' | 'warning' | 'error';
}

const NotificationToast: React.FC<NotificationToastProps> = ({ 
  message, 
  duration = 2000, 
  onClose,
  type = 'success'
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const { animationsEnabled } = useAnimations();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Allow time for exit animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-white" />;
      case 'info':
        return <Info className="h-4 w-4 text-white" />;
      case 'warning':
      case 'error':
        return <AlertCircle className="h-4 w-4 text-white" />;
      default:
        return null;
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-500';
      case 'info':
        return 'bg-blue-500';
      case 'warning':
        return 'bg-amber-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-black';
    }
  };

  // Animation properties
  const motionProps = animationsEnabled ? {
    initial: { opacity: 0, y: -20, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -20, scale: 0.95 },
    transition: { 
      duration: 0.2, 
      type: "spring", 
      stiffness: 500, 
      damping: 30 
    }
  } : {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.2 }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          {...motionProps}
          className={`fixed top-16 left-1/2 transform -translate-x-1/2 z-50 ${getBackgroundColor()} bg-opacity-90 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg flex items-center space-x-2`}
        >
          {getIcon()}
          <span>{message}</span>
          <button 
            onClick={() => {
              setIsVisible(false);
              setTimeout(onClose, 300);
            }}
            className="ml-2 hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-colors"
          >
            <X size={14} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NotificationToast;
