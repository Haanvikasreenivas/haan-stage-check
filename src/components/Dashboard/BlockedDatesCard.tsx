
import React from 'react';
import { format } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { getContrastTextColor } from '@/utils/colorUtils';

interface BlockedDatesCardProps {
  project: {
    id: string;
    name: string;
    color?: string; // Make color optional
  };
  dates: Date[];
  onClick?: () => void;
}

const BlockedDatesCard: React.FC<BlockedDatesCardProps> = ({ project, dates, onClick }) => {
  // Format dates to display
  const formattedDates = dates
    .sort((a, b) => a.getTime() - b.getTime())
    .map(date => format(date, 'MMM d'))
    .join(', ');

  // Default color if none is provided
  const projectColor = project.color || '#000000';
  
  // Get contrasting text color for the project name
  const textColorClass = getContrastTextColor(projectColor);

  return (
    <Card 
      className="w-full overflow-hidden transition-all duration-300 hover:shadow-md cursor-pointer animate-fade-in rounded-xl hover:translate-y-[-2px]"
      onClick={onClick}
    >
      <div 
        className="h-3 rounded-t-xl"
        style={{ backgroundColor: projectColor }}
      />
      <CardContent className="p-4">
        <h3 
          className={`font-medium text-lg mb-1 ${textColorClass === 'text-white' ? 'text-gray-800' : 'text-gray-800'}`}
        >
          {project.name}
        </h3>
        <p className="text-sm text-gray-600">
          {dates.length > 1 ? `${dates.length} dates: ` : 'Date: '}{formattedDates}
        </p>
      </CardContent>
    </Card>
  );
};

export default BlockedDatesCard;
