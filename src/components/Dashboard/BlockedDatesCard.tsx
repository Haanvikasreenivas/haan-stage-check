
import React from 'react';
import { format } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';

interface BlockedDatesCardProps {
  project: {
    id: string;
    name: string;
    color: string;
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

  return (
    <Card 
      className="w-full overflow-hidden transition-shadow hover:shadow-md cursor-pointer animate-fade-in"
      onClick={onClick}
    >
      <div 
        className="h-2"
        style={{ backgroundColor: project.color }}
      />
      <CardContent className="p-4">
        <h3 
          className="font-medium text-lg mb-1"
          style={{ color: project.color }}
        >
          {project.name}
        </h3>
        <p className="text-sm text-gray-600">
          Dates: {formattedDates}
        </p>
      </CardContent>
    </Card>
  );
};

export default BlockedDatesCard;
