
import React, { useEffect, useRef } from 'react';
import { Home, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProfileSection from './ProfileSection';
import { CalendarDay, UserProfile } from '@/types';

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
  onHomeClick: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  calendarDays,
  onDateSelect,
  onProfileSubmit,
  profile,
  onHomeClick,
}) => {
  const sidebarRef = useRef<HTMLDivElement>(null);
  
  // Get first name from profile
  const firstName = profile.name ? profile.name.split(' ')[0] : '';

  // Function to handle profile submission and close sidebar
  const handleProfileSubmit = (name: string, email?: string, phone?: string, notes?: string) => {
    onProfileSubmit(name, email, phone, notes);
    // Sidebar will be closed in the parent component
  };

  return (
    <div 
      className={`fixed inset-0 z-50 bg-black/25 backdrop-blur-sm transition-opacity ${
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      data-sidebar="overlay"
    >
      <div 
        ref={sidebarRef}
        data-sidebar="sidebar"
        className={`fixed inset-y-0 left-0 z-50 w-3/4 max-w-sm bg-white shadow-xl transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out animate-fade-in`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold flex items-center gap-1">
            {firstName ? `Hey ${firstName}` : 'Menu'}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="overflow-auto h-full pb-24">
          {/* Profile Section with Edit button beside */}
          <div className="p-4 border-b">
            <ProfileSection 
              profile={profile}
              onSubmit={handleProfileSubmit}
            />
          </div>
          
          {/* Home Button - Will close the sidebar */}
          <div className="p-4 border-b">
            <Button 
              variant="outline" 
              className="w-full flex items-center justify-center gap-2"
              onClick={() => {
                onHomeClick();
                onClose();
              }}
            >
              <Home className="h-4 w-4" />
              Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
