import React from 'react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Project } from '@/types';
import { getContrastTextColor } from '@/utils/colorUtils';

interface CalendarDayCellProps {
  date: Date;
  isToday: boolean;
  isCurrentMonth: boolean;
  onClick: () => void;
  project?: Project;
}

const CalendarDayCell: React.FC<CalendarDayCellProps> = ({
  date,
  isToday,
  isCurrentMonth,
  onClick,
  project
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

  const isBlocked = project?.status === 'blocked';
  const isCanceled = project?.status === 'canceled';

  const cellClasses = cn(
    'calendar-day relative flex flex-col items-center justify-center h-16 w-full cursor-pointer rounded-xl transition-all duration-200 p-1',
    isToday && !isBlocked && 'ring-2 ring-primary ring-offset-2',
    !isCurrentMonth && 'text-gray-400',
    isBlocked && 'text-white',
    isCanceled && 'line-through opacity-50'
  );

  return (
    <motion.div
      variants={variants}
      whileHover="hover"
      whileTap="tap"
      onClick={onClick}
      className={cellClasses}
      style={isBlocked ? {
        background: project.color || '#000000',
        color: getContrastTextColor(project.color || '#000000')
      } : undefined}
    >
      <span className="text-sm font-medium">{format(date, 'd')}</span>
      {project && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-[10px] mt-0.5 truncate w-full text-center"
          style={isBlocked ? {
            color: getContrastTextColor(project.color || '#000000')
          } : undefined}
        >
          {project.name}
        </motion.div>
      )}
    </motion.div>
  );
};

export default CalendarDayCell;
