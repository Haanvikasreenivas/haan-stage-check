
import React, { useEffect, useRef } from 'react';
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
  const sidebarRef = useRef<HTMLDivElement>(null);
  
  // Close sidebar when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (isOpen && sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen, onClose]);
  
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
  
  // Get first name from profile
  const firstName = profile.name ? profile.name.split(' ')[0] : '';

  return (
    <div 
      className={`fixed inset-0 z-50 bg-black/25 backdrop-blur-sm transition-opacity ${
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div 
        ref={sidebarRef}
        className={`fixed inset-y-0 left-0 z-50 w-3/4 max-w-sm bg-white shadow-xl transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out animate-fade-in`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">
            {firstName ? `Hey ${firstName}` : 'Menu'}
          </h2>
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
          <div className="p-4">
            <h3 className="text-lg font-medium mb-2">Blocked Dates</h3>
            {Object.values(blockedProjects).length > 0 ? (
              <ul className="space-y-3">
                {Object.values(blockedProjects).map(({ project, dates }) => (
                  <li 
                    key={project.id} 
                    className="bg-gray-50 p-3 rounded-md"
                    style={{ borderLeftColor: project.color, borderLeftWidth: '4px' }}
                  >
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
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
