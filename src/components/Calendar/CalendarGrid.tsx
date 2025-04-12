
import React from 'react';
import { format, isSameMonth, isToday, startOfMonth, endOfMonth, eachDayOfInterval, getDay } from 'date-fns';
import { CalendarDay as CalendarDayType } from '@/types';
import { cn } from '@/lib/utils';
import CalendarDayCell from './CalendarDayCell';

interface CalendarGridProps {
  currentMonth: Date;
  calendarDays: CalendarDayType[];
  onDateClick: (date: Date) => void;
}

const CalendarGrid: React.FC<CalendarGridProps> = ({ currentMonth, calendarDays, onDateClick }) => {
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = monthStart;
  const endDate = monthEnd;

  const days = eachDayOfInterval({ start: startDate, end: endDate });
  
  // Generate day headers (Sun, Mon, etc.)
  const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  // Calculate offset for first day of month
  const firstDayOfMonth = getDay(monthStart);
  
  // Create empty cells for days before the start of the month
  const emptyCellsBefore = Array.from({ length: firstDayOfMonth }).map((_, i) => (
    <div key={`empty-before-${i}`} className="calendar-day opacity-0"></div>
  ));

  // Create day cells
  const dayCells = days.map(day => {
    const calendarDay = calendarDays.find(
      cDay => format(cDay.date, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
    ) || { date: day };
    
    return (
      <CalendarDayCell
        key={format(day, 'yyyy-MM-dd')}
        calendarDay={calendarDay}
        isToday={isToday(day)}
        isCurrentMonth={isSameMonth(day, currentMonth)}
        onClick={() => onDateClick(day)}
      />
    );
  });

  // Combine empty cells and day cells
  const allCells = [...emptyCellsBefore, ...dayCells];

  return (
    <div className="w-full fade-in">
      <div className="grid grid-cols-7 mb-2">
        {dayHeaders.map(day => (
          <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {allCells}
      </div>
    </div>
  );
};

export default CalendarGrid;
