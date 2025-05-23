
import React from 'react';
import { format, isSameMonth } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { getContrastTextColor } from '@/utils/colorUtils';
import { motion } from 'framer-motion';
import { useAnimations } from '@/contexts/AnimationContext';
import { Calendar, MapPin } from 'lucide-react';

interface BlockedDatesCardProps {
  project: {
    id: string;
    name: string;
    color?: string;
    notes?: string;
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
    let currentGroup: Date[] = [sortedDates[0]];
    
    for (let i = 1; i < sortedDates.length; i++) {
      const currentDate = sortedDates[i];
      const prevDate = sortedDates[i - 1];
      const diffDays = Math.round((currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1 && isSameMonth(currentDate, prevDate)) {
        currentGroup.push(currentDate);
      } else {
        groups.push([...currentGroup]);
        currentGroup = [currentDate];
      }
    }
    
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

  const animationProps = animationsEnabled ? {
    initial: { opacity: 0, y: 20, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    whileHover: { scale: 1.02, transition: { duration: 0.2 } },
    whileTap: { scale: 0.98 }
  } : {};

  const calculateGradient = (color: string) => {
    return `linear-gradient(135deg, ${color}, ${color}dd)`;
  };

  return (
    <motion.div {...animationProps}>
      <Card 
        className="overflow-hidden cursor-pointer group shadow-md hover:shadow-lg transition-all duration-300"
        onClick={onClick}
      >
        <div 
          className="h-3 transition-all duration-300 group-hover:h-4"
          style={{ background: calculateGradient(project.color || '#000000') }}
        />
        <CardContent className="p-5 space-y-3">
          <div className="flex items-start justify-between">
            <h3 className="font-semibold text-lg text-gray-900 group-hover:text-gray-700 transition-colors">
              {project.name}
            </h3>
            <motion.div 
              whileHover={{ rotate: 15, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Calendar className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
            </motion.div>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <p className="font-medium">{dates.length} {dates.length === 1 ? 'date' : 'dates'} blocked</p>
          </div>
          
          <p className="text-sm text-gray-600 leading-relaxed font-medium">
            {formatDatesCompact(dates)}
          </p>
          
          {project.notes && (
            <div className="flex items-start pt-2 border-t border-gray-100">
              <MapPin className="w-4 h-4 mr-2 text-gray-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-500">{project.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default BlockedDatesCard;
