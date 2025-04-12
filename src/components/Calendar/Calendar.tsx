
import React, { useState, useEffect } from 'react';
import { addMonths, subMonths, startOfToday } from 'date-fns';
import CalendarHeader from './CalendarHeader';
import CalendarGrid from './CalendarGrid';
import { CalendarDay } from '@/types';
import { useCalendarData } from '@/hooks/useCalendarData';

interface CalendarProps {
  onDateClick: (date: Date) => void;
}

const Calendar: React.FC<CalendarProps> = ({ onDateClick }) => {
  const [currentMonth, setCurrentMonth] = useState<Date>(startOfToday());
  const { calendarDays } = useCalendarData(currentMonth);

  const goToPreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const goToToday = () => {
    setCurrentMonth(startOfToday());
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <CalendarHeader 
        currentMonth={currentMonth}
        onPreviousMonth={goToPreviousMonth}
        onNextMonth={goToNextMonth}
      />
      <CalendarGrid 
        currentMonth={currentMonth}
        calendarDays={calendarDays}
        onDateClick={onDateClick}
      />
    </div>
  );
};

export default Calendar;
