
import React from 'react';
import { format } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CalendarHeaderProps {
  currentMonth: Date;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  currentMonth,
  onPreviousMonth,
  onNextMonth,
}) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-xl font-semibold">
        {format(currentMonth, 'MMMM yyyy')}
      </h2>
      <div className="flex space-x-1">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onPreviousMonth}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onNextMonth}
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default CalendarHeader;
