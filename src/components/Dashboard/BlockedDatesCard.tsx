
import React from 'react';
import { format } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';

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

  return (
    <Card 
      className="w-full overflow-hidden transition-shadow hover:shadow-md cursor-pointer animate-fade-in rounded-lg"
      onClick={onClick}
    >
      <div 
        className="h-2 rounded-t-lg"
        style={{ backgroundColor: projectColor }}
      />
      <CardContent className="p-4">
        <h3 
          className="font-medium text-lg mb-1"
          style={{ color: projectColor }}
        >
          {project.name.toUpperCase()}
        </h3>
        <p className="text-sm text-gray-600">
          Dates: {formattedDates}
        </p>
      </CardContent>
    </Card>
  );
};

export default BlockedDatesCard;
