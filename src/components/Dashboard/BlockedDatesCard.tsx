
import React from 'react';
import { format } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { getContrastTextColor } from '@/utils/colorUtils';
import { motion } from 'framer-motion';

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
  // Format dates to display in a more compact way
  const formatDatesCompact = (dates: Date[]) => {
    if (!dates.length) return '';
    
    // Sort dates chronologically
    const sortedDates = [...dates].sort((a, b) => a.getTime() - b.getTime());
    
    // Format each date to just show month and day
    return sortedDates.map(date => format(date, 'MMM d')).join(', ');
  };

  // Default color if none is provided
  const projectColor = project.color || '#000000';
  
  // Get contrasting text color for the project name
  const textColorClass = getContrastTextColor(projectColor);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card 
        className="w-full overflow-hidden cursor-pointer rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
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
            {dates.length > 1 ? `${dates.length} dates: ` : 'Date: '}
            {formatDatesCompact(dates)}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default BlockedDatesCard;
