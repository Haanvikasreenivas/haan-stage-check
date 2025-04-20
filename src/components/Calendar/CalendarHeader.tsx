
import React from 'react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAnimations } from '@/contexts/AnimationContext';

interface CalendarHeaderProps {
  currentMonth: Date;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  userName?: string;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  currentMonth,
  onPreviousMonth,
  onNextMonth
}) => {
  const { animationsEnabled } = useAnimations();

  const buttonVariants = {
    hover: { 
      scale: 1.1,
      transition: { duration: 0.2 }
    },
    tap: { 
      scale: 0.95,
      transition: { duration: 0.1 }
    }
  };

  const titleVariants = {
    initial: { opacity: 0, y: -20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="flex flex-col space-y-2 w-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <motion.h2 
            key={currentMonth.toISOString()}
            variants={titleVariants}
            initial="initial"
            animate="animate"
            className="text-xl font-semibold"
          >
            {format(currentMonth, 'MMMM yyyy')}
          </motion.h2>
          <div className="flex space-x-1">
            <motion.div
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onPreviousMonth}
                className="h-8 w-8 rounded-full hover:bg-gray-100 transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
            </motion.div>
            <motion.div
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onNextMonth}
                className="h-8 w-8 rounded-full hover:bg-gray-100 transition-colors"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarHeader;
