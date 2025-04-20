
import React from 'react';
import { format, isSameMonth } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { getContrastTextColor } from '@/utils/colorUtils';
import { motion } from 'framer-motion';
import { useAnimations } from '@/contexts/AnimationContext';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { toast } from 'sonner';

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

  // Card animation properties
  const animationProps = animationsEnabled ? {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    whileHover: { scale: 1.02, transition: { duration: 0.2 } },
    whileTap: { scale: 0.98 }
  } : {};

  const handleClick = () => {
    onClick?.();
    toast.success(`Viewing ${project.name}`);
  };

  return (
    <motion.div {...animationProps}>
      <Card 
        className="overflow-hidden cursor-pointer group"
        onClick={handleClick}
      >
        <div 
          className="h-2 transition-all duration-200 group-hover:h-3"
          style={{ backgroundColor: project.color || '#000000' }}
        />
        <CardContent className="p-4 space-y-3">
          <div className="flex items-start justify-between">
            <h3 className="font-medium text-lg text-gray-900 group-hover:text-gray-700 transition-colors">
              {project.name}
            </h3>
            <Calendar className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="w-4 h-4 mr-2" />
            <p>{dates.length} {dates.length === 1 ? 'date' : 'dates'} blocked</p>
          </div>
          
          <p className="text-sm text-gray-600 leading-relaxed">
            {formatDatesCompact(dates)}
          </p>
          
          {project.notes && (
            <div className="flex items-start pt-2">
              <MapPin className="w-4 h-4 mr-2 text-gray-400 mt-0.5" />
              <p className="text-sm text-gray-500">{project.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default BlockedDatesCard;
