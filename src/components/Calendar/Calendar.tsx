
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
  userName?: string;
}

const Calendar: React.FC<CalendarProps> = ({ onDateClick, userName }) => {
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
    <div className="w-full max-w-3xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <CalendarHeader 
          currentMonth={currentMonth}
          onPreviousMonth={goToPreviousMonth}
          onNextMonth={goToNextMonth}
          userName={userName}
        />
        <Button 
          variant="outline" 
          size="sm" 
          onClick={goToToday}
          className="ml-2 hover:bg-gray-100 transition-colors"
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
