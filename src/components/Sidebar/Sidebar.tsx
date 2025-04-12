
import React from 'react';
import { format } from 'date-fns';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProfileSection from './ProfileSection';
import { CalendarDay, Project } from '@/types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  calendarDays: CalendarDay[];
  onDateSelect: (date: Date) => void;
  onProfileSubmit: (name: string, email?: string, phone?: string, notes?: string) => void;
  profile: {
    name: string;
    email?: string;
    phone?: string;
    notes?: string;
  };
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  calendarDays,
  onDateSelect,
  onProfileSubmit,
  profile,
}) => {
  // Group blocked dates by project
  const blockedProjects: { [projectId: string]: { project: Project, dates: Date[] } } = {};
  
  calendarDays.forEach((day) => {
    if (day.project && day.project.status === 'blocked') {
      if (!blockedProjects[day.project.id]) {
        blockedProjects[day.project.id] = {
          project: day.project,
          dates: []
        };
      }
      blockedProjects[day.project.id].dates.push(day.date);
    }
  });
  
  // Get available dates (next 30 days)
  const today = new Date();
  const availableDates = calendarDays
    .filter(day => 
      !day.project && 
      day.date >= today && 
      day.date <= new Date(today.getFullYear(), today.getMonth(), today.getDate() + 30)
    )
    .map(day => day.date);

  return (
    <div className={`fixed inset-y-0 left-0 z-50 w-3/4 max-w-sm bg-white shadow-xl transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out`}>
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-xl font-semibold">Haan Menu</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="overflow-auto h-full pb-24">
        {/* Profile Section */}
        <div className="p-4 border-b">
          <h3 className="text-lg font-medium mb-2">Profile</h3>
          <ProfileSection 
            profile={profile}
            onSubmit={onProfileSubmit}
          />
        </div>
        
        {/* Blocked Dates Section */}
        <div className="p-4 border-b">
          <h3 className="text-lg font-medium mb-2">Blocked Dates</h3>
          {Object.values(blockedProjects).length > 0 ? (
            <ul className="space-y-3">
              {Object.values(blockedProjects).map(({ project, dates }) => (
                <li key={project.id} className="bg-gray-50 p-3 rounded-md">
                  <div 
                    className="font-medium mb-1" 
                    style={{ color: project.color || 'black' }}
                  >
                    {project.name}
                  </div>
                  <div className="text-sm text-gray-600">
                    {dates.map(date => format(date, 'MMM d')).join(', ')}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No blocked dates</p>
          )}
        </div>
        
        {/* Available Dates Section */}
        <div className="p-4">
          <h3 className="text-lg font-medium mb-2">Available Dates</h3>
          {availableDates.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {availableDates.map(date => (
                <Button 
                  key={format(date, 'yyyy-MM-dd')} 
                  variant="outline" 
                  size="sm"
                  className="text-xs"
                  onClick={() => {
                    onDateSelect(date);
                    onClose();
                  }}
                >
                  {format(date, 'MMM d')}
                </Button>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No available dates in the next 30 days</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
