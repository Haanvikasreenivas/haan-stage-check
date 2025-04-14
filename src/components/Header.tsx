
import React from 'react';
import { Button } from "@/components/ui/button";
import { Search, Menu, Bell } from 'lucide-react';

interface HeaderProps {
  onSearchClick: () => void;
  onTodayClick?: () => void;
  onMenuClick: () => void;
  onReminderClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  onSearchClick, 
  onMenuClick,
  onReminderClick 
}) => {
  return (
    <header className="flex items-center justify-between p-4 border-b bg-white shadow-sm">
      <Button 
        variant="ghost" 
        size="icon"
        onClick={onMenuClick}
        data-sidebar="trigger"
      >
        <Menu className="h-5 w-5" />
      </Button>
      
      <div className="flex items-center justify-center gap-1 absolute left-1/2 transform -translate-x-1/2">
        <span className="font-bold tracking-wide text-xl">HAAN</span>
      </div>
      
      <div className="flex items-center gap-1">
        {onReminderClick && (
          <Button 
            variant="ghost" 
            onClick={onReminderClick}
            size="icon"
            className="hover:bg-gray-100 transition-colors rounded-full"
          >
            <Bell className="h-5 w-5" />
          </Button>
        )}
        
        <Button 
          variant="ghost" 
          onClick={onSearchClick}
          size="icon"
          className="hover:bg-gray-100 transition-colors rounded-full"
        >
          <Search className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
};

export default Header;
