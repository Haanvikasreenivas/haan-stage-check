
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

  // Calculate text color based on background color
  const getContrastColor = (hexColor: string) => {
    // Convert hex to RGB
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    
    // Calculate luminance (perceived brightness)
    // Using the formula from WCAG 2.0
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    // Return white for dark colors, black for light colors
    return luminance > 0.5 ? 'text-black' : 'text-white';
  };

  // Determine day cell classes
  const dayCellClasses = cn(
    'calendar-day relative flex items-center justify-center h-10 w-10 cursor-pointer transition-all duration-200',
    isToday && !isBlocked && 'ring-2 ring-primary',
    !isCurrentMonth && 'text-gray-400',
    isBlocked && 'rounded-lg overflow-hidden',
    !isBlocked && !isCanceled && 'hover:bg-gray-100'
  );

  // Custom style for project color
  const dayStyle = isBlocked && project?.color ? {
    backgroundColor: project.color,
  } : isCanceled ? { 
    backgroundColor: '#f3f4f6' 
  } : {};
  
  // Determine text color class based on background color for blocked dates
  const textColorClass = isBlocked && project?.color 
    ? getContrastColor(project.color) 
    : '';

  return (
    <div 
      className={dayCellClasses}
      style={dayStyle}
      onClick={onClick}
    >
      <div className="calendar-day-content flex flex-col items-center justify-center">
        <span className={textColorClass}>{format(date, 'd')}</span>
        {project && (
          <span className={cn("project-indicator text-[8px] font-medium", textColorClass)}>
            {project.name.substring(0, 4)}
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
