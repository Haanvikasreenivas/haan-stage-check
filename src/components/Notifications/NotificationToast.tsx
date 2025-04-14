
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Info, AlertCircle } from 'lucide-react';

interface NotificationToastProps {
  message: string;
  duration?: number;
  onClose: () => void;
  type?: 'success' | 'info' | 'warning' | 'error';
}

const NotificationToast: React.FC<NotificationToastProps> = ({ 
  message, 
  duration = 1000, 
  onClose,
  type = 'success'
}) => {
  const [isVisible, setIsVisible] = useState(true);

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

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ 
            duration: 0.3, 
            type: "spring", 
            stiffness: 500, 
            damping: 30 
          }}
          className={`fixed top-16 left-1/2 transform -translate-x-1/2 z-50 ${getBackgroundColor()} bg-opacity-90 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg flex items-center space-x-2`}
        >
          {getIcon()}
          <span>{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NotificationToast;
