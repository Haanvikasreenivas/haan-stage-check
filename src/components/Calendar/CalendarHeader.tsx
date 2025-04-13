
import React from 'react';
import { format } from 'date-fns';
import { ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CalendarHeaderProps {
  currentMonth: Date;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  userName?: string;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  currentMonth,
  onPreviousMonth,
  onNextMonth,
  userName
}) => {
  // Extract first name if available
  const firstName = userName ? userName.split(' ')[0] : '';
  
  return (
    <div className="flex flex-col space-y-2 w-full">
      {firstName && (
        <h2 className="text-xl font-semibold animate-fade-in text-center flex justify-center items-center gap-1">
          Hey {firstName} <Heart className="h-4 w-4 fill-red-500 text-red-500" />
        </h2>
      )}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-semibold">
            {format(currentMonth, 'MMMM yyyy')}
          </h2>
          <div className="flex space-x-1">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onPreviousMonth}
              className="h-8 w-8 rounded-full hover:bg-gray-100 transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onNextMonth}
              className="h-8 w-8 rounded-full hover:bg-gray-100 transition-colors"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarHeader;
