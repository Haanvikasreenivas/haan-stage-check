
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface NotificationToastProps {
  message: string;
  duration?: number;
  onClose: () => void;
}

const NotificationToast: React.FC<NotificationToastProps> = ({ 
  message, 
  duration = 1000, 
  onClose 
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Allow time for exit animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="fixed top-16 left-1/2 transform -translate-x-1/2 z-50 bg-black bg-opacity-80 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg"
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NotificationToast;
