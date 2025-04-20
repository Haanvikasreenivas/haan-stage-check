
import React from 'react';
import { format, isSameMonth, isToday, startOfMonth, endOfMonth, eachDayOfInterval, getDay } from 'date-fns';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import CalendarDayCell from './CalendarDayCell';
import { CalendarDay } from '@/types';

interface CalendarGridProps {
  currentMonth: Date;
  onDateClick: (date: Date) => void;
  calendarDays?: CalendarDay[];
}

const CalendarGrid: React.FC<CalendarGridProps> = ({ currentMonth, onDateClick, calendarDays = [] }) => {
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = monthStart;
  const endDate = monthEnd;

  const days = eachDayOfInterval({ start: startDate, end: endDate });
  const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const firstDayOfMonth = getDay(monthStart);
  
  const emptyCellsBefore = Array.from({ length: firstDayOfMonth }).map((_, i) => (
    <div key={`empty-before-${i}`} className="calendar-day opacity-0"></div>
  ));

  const getCalendarDay = (date: Date) => {
    return calendarDays.find(day => 
      format(day.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
  };

  const dayCells = days.map((day, index) => (
    <motion.div
      key={format(day, 'yyyy-MM-dd')}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.3,
        delay: index * 0.02,
        ease: "easeOut"
      }}
    >
      <CalendarDayCell
        date={day}
        isToday={isToday(day)}
        isCurrentMonth={isSameMonth(day, currentMonth)}
        onClick={() => onDateClick(day)}
        project={getCalendarDay(day)?.project}
      />
    </motion.div>
  ));

  const allCells = [...emptyCellsBefore, ...dayCells];

  return (
    <div className="w-full bg-white rounded-xl p-4 shadow-lg">
      <div className="grid grid-cols-7 mb-4">
        {dayHeaders.map(day => (
          <div 
            key={day} 
            className="text-center text-sm font-semibold text-gray-600 py-2"
          >
            {day}
          </div>
        ))}
      </div>
      <motion.div 
        className="grid grid-cols-7 gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {allCells}
      </motion.div>
    </div>
  );
};

export default CalendarGrid;
