
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
    'calendar-day',
    {
      'bg-blue-100': isBlocked,
      'bg-gray-100': isCanceled,
      'ring-2 ring-primary': isToday,
      'text-gray-400': !isCurrentMonth,
      'blocked': isBlocked,
      'canceled': isCanceled
    }
  );

  return (
    <div 
      className={dayCellClasses}
      onClick={onClick}
    >
      <div className="calendar-day-content">
        <span className="day-indicator">{format(date, 'd')}</span>
        {project && (
          <span className="project-indicator text-xs">
            {project.name.substring(0, 5)}
          </span>
        )}
      </div>
    </div>
  );
};

export default CalendarDayCell;
