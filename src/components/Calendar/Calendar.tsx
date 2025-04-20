import React, { useState, useEffect } from 'react';
import { addMonths, subMonths, startOfToday } from 'date-fns';
import { motion } from 'framer-motion';
import CalendarHeader from './CalendarHeader';
import CalendarGrid from './CalendarGrid';
import { CalendarDay } from '@/types';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon } from 'lucide-react';
import { useAnimations } from '@/contexts/AnimationContext';

interface CalendarProps {
  onDateClick: (date: Date) => void;
  userName?: string;
  onMonthChange?: (month: Date) => void;
  calendarDays?: CalendarDay[];
}

const Calendar: React.FC<CalendarProps> = ({ 
  onDateClick, 
  userName, 
  onMonthChange,
  calendarDays = []
}) => {
  const [currentMonth, setCurrentMonth] = useState<Date>(startOfToday());
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('left');
  const { animationsEnabled, getAnimationDuration } = useAnimations();

  const goToPreviousMonth = () => {
    setSlideDirection('right');
    const prevMonth = subMonths(currentMonth, 1);
    setCurrentMonth(prevMonth);
    if (onMonthChange) onMonthChange(prevMonth);
  };

  const goToNextMonth = () => {
    setSlideDirection('left');
    const nextMonth = addMonths(currentMonth, 1);
    setCurrentMonth(nextMonth);
    if (onMonthChange) onMonthChange(nextMonth);
  };

  const goToToday = () => {
    const today = startOfToday();
    setSlideDirection(currentMonth < today ? 'left' : 'right');
    setCurrentMonth(today);
    if (onMonthChange) onMonthChange(today);
  };

  useEffect(() => {
    if (onMonthChange) onMonthChange(currentMonth);
  }, []);

  const calendarVariants = {
    enter: (direction: 'left' | 'right') => ({
      x: direction === 'right' ? -300 : 300,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: 'left' | 'right') => ({
      x: direction === 'right' ? 300 : -300,
      opacity: 0
    })
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
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
          className="ml-2 hover:bg-gray-100 transition-all duration-200 transform hover:scale-105"
        >
          <CalendarIcon className="h-4 w-4 mr-1" />
          Today
        </Button>
      </div>

      <motion.div
        key={currentMonth.toISOString()}
        custom={slideDirection}
        variants={calendarVariants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{
          duration: getAnimationDuration(0.3),
          type: "spring",
          stiffness: 300,
          damping: 30
        }}
      >
        <CalendarGrid 
          currentMonth={currentMonth}
          onDateClick={onDateClick}
          calendarDays={calendarDays}
        />
      </motion.div>
    </div>
  );
};

export default Calendar;
