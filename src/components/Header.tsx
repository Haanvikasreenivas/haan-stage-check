
import React from 'react';
import { Button } from "@/components/ui/button";
import { Search, Calendar as CalendarIcon, Menu } from 'lucide-react';
import Logo from './Logo';

interface HeaderProps {
  onSearchClick: () => void;
  onTodayClick: () => void;
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onSearchClick, onTodayClick, onMenuClick }) => {
  return (
    <header className="flex items-center justify-between p-4 border-b bg-white shadow-sm">
      <Button 
        variant="ghost" 
        size="icon"
        onClick={onMenuClick}
      >
        <Menu className="h-5 w-5" />
      </Button>
      
      <Logo />
      
      <div className="flex items-center gap-1">
        <Button 
          variant="ghost" 
          onClick={onTodayClick}
          className="flex items-center gap-1"
          size="sm"
        >
          <CalendarIcon className="h-4 w-4" />
          <span className="text-sm">Today</span>
        </Button>
        
        <Button 
          variant="ghost" 
          onClick={onSearchClick}
          size="icon"
        >
          <Search className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
};

export default Header;
