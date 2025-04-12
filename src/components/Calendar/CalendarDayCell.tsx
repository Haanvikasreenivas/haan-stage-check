
import React from 'react';
import { format } from 'date-fns';
import { CalendarDay } from '@/types';
import { cn } from '@/lib/utils';

interface CalendarDayCellProps {
  calendarDay: CalendarDay;
  isToday: boolean;
  isCurrentMonth: boolean;
  onClick: () => void;
}

const CalendarDayCell: React.FC<CalendarDayCellProps> = ({
  calendarDay,
  isToday,
  isCurrentMonth,
  onClick,
}) => {
  const { date, project } = calendarDay;
  
  const isBlocked = project?.status === 'blocked';
  const isCanceled = project?.status === 'canceled';
  
  // Determine day cell classes
  const dayCellClasses = cn(
    'calendar-day relative flex items-center justify-center h-10 w-10 cursor-pointer transition-colors',
    {
      'ring-2 ring-primary': isToday,
      'text-gray-400': !isCurrentMonth,
    }
  );

  // Calculate text color based on background color
  const getTextColor = (bgColor: string) => {
    // Simple check if background is dark, return white text, otherwise black
    const r = parseInt(bgColor.slice(1, 3), 16);
    const g = parseInt(bgColor.slice(3, 5), 16);
    const b = parseInt(bgColor.slice(5, 7), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? 'text-black' : 'text-white';
  };

  // Custom style for project color
  const dayStyle = isBlocked && project?.color ? {
    backgroundColor: project.color,
    borderRadius: '8px', // Make blocked dates rounded with 8px corners
  } : isCanceled ? { 
    backgroundColor: '#f3f4f6' 
  } : {};
  
  const textColorClass = isBlocked && project?.color ? getTextColor(project.color) : '';

  return (
    <div 
      className={dayCellClasses}
      style={dayStyle}
      onClick={onClick}
    >
      <div className="calendar-day-content flex flex-col items-center justify-center">
        <span className={cn("day-indicator", textColorClass)}>{format(date, 'd')}</span>
        {project && (
          <span className={cn("project-indicator text-xs", textColorClass)}>
            {project.name.substring(0, 5)}
          </span>
        )}
      </div>
      {isCanceled && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full h-px bg-gray-400 rotate-45"></div>
        </div>
      )}
    </div>
  );
};

export default CalendarDayCell;
