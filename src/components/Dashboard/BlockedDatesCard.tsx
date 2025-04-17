
import React from 'react';
import { format, isSameMonth, parse } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { getContrastTextColor } from '@/utils/colorUtils';
import { motion } from 'framer-motion';
import { useAnimations } from '@/contexts/AnimationContext';

interface BlockedDatesCardProps {
  project: {
    id: string;
    name: string;
    color?: string;
  };
  dates: Date[];
  onClick?: () => void;
}

const BlockedDatesCard: React.FC<BlockedDatesCardProps> = ({ project, dates, onClick }) => {
  const { animationsEnabled } = useAnimations();
  
  // Format dates to display in a more compact way
  const formatDatesCompact = (dates: Date[]) => {
    if (!dates.length) return '';
    
    // Sort dates chronologically
    const sortedDates = [...dates].sort((a, b) => a.getTime() - b.getTime());
    
    // Group consecutive dates
    const groups: Date[][] = [];
    let currentGroup: Date[] = [];
    
    sortedDates.forEach((date, index) => {
      if (index === 0) {
        currentGroup.push(date);
      } else {
        const prevDate = sortedDates[index - 1];
        const diffDays = Math.round((date.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1 && isSameMonth(date, prevDate)) {
          currentGroup.push(date);
        } else {
          groups.push([...currentGroup]);
          currentGroup = [date];
        }
      }
    });
    
    if (currentGroup.length > 0) {
      groups.push(currentGroup);
    }
    
    // Format each group
    return groups.map(group => {
      if (group.length === 1) {
        return format(group[0], 'MMM d');
      } else {
        return `${format(group[0], 'MMM d')}–${format(group[group.length - 1], 'd')}`;
      }
    }).join(', ');
  };

  // Default color if none is provided
  const projectColor = project.color || '#000000';
  
  // Get contrasting text color for the project name
  const textColorClass = getContrastTextColor(projectColor);

  // Card animation properties
  const animationProps = animationsEnabled ? {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: { duration: 0.2 },
    whileHover: { scale: 1.02 },
    whileTap: { scale: 0.98 }
  } : {};

  return (
    <motion.div {...animationProps}>
      <Card 
        className="w-full overflow-hidden cursor-pointer rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
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
            {dates.length > 0 ? formatDatesCompact(dates) : 'No dates'}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default BlockedDatesCard;
