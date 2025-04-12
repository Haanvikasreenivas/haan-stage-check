
import React, { useState, useEffect } from 'react';
import { addMonths, subMonths, startOfToday } from 'date-fns';
import CalendarHeader from './CalendarHeader';
import CalendarGrid from './CalendarGrid';
import { CalendarDay } from '@/types';
import { useCalendarData } from '@/hooks/useCalendarData';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon } from 'lucide-react';

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
    <div className="w-full max-w-3xl mx-auto fade-in">
      <div className="flex items-center justify-between mb-2">
        <CalendarHeader 
          currentMonth={currentMonth}
          onPreviousMonth={goToPreviousMonth}
          onNextMonth={goToNextMonth}
        />
        <Button 
          variant="outline" 
          size="sm" 
          onClick={goToToday}
          className="ml-2"
        >
          <CalendarIcon className="h-4 w-4 mr-1" />
          Today
        </Button>
      </div>
      <CalendarGrid 
        currentMonth={currentMonth}
        calendarDays={calendarDays}
        onDateClick={onDateClick}
      />
    </div>
  );
};

export default Calendar;
