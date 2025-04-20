
import React from 'react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { getContrastTextColor } from '@/utils/colorUtils';

interface CalendarDayCellProps {
  date: Date;
  isToday: boolean;
  isCurrentMonth: boolean;
  onClick: () => void;
}

const CalendarDayCell: React.FC<CalendarDayCellProps> = ({
  date,
  isToday,
  isCurrentMonth,
  onClick,
}) => {
  const variants = {
    hover: { 
      scale: 1.1,
      transition: { duration: 0.2 }
    },
    tap: { 
      scale: 0.95,
      transition: { duration: 0.1 }
    }
  };

  const cellClasses = cn(
    'calendar-day relative flex items-center justify-center h-10 w-10 cursor-pointer',
    'rounded-full transition-all duration-200',
    isToday && 'ring-2 ring-primary ring-offset-2',
    !isCurrentMonth && 'text-gray-400',
    'hover:bg-gray-100'
  );

  return (
    <motion.div
      variants={variants}
      whileHover="hover"
      whileTap="tap"
      onClick={onClick}
      className={cellClasses}
    >
      <div className="calendar-day-content flex items-center justify-center">
        <span>{format(date, 'd')}</span>
      </div>
    </motion.div>
  );
};

export default CalendarDayCell;
