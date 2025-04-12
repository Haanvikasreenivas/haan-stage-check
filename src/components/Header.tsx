
import React from 'react';
import { Button } from "@/components/ui/button";
import { Search, Calendar as CalendarIcon } from 'lucide-react';
import Logo from './Logo';

interface HeaderProps {
  onSearchClick: () => void;
  onTodayClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onSearchClick, onTodayClick }) => {
  return (
    <header className="flex items-center justify-between p-4 border-b bg-white shadow-sm">
      <Button 
        variant="ghost" 
        onClick={onTodayClick}
        className="flex items-center gap-1"
      >
        <CalendarIcon className="h-4 w-4" />
        <span className="text-sm">Today</span>
      </Button>
      
      <Logo />
      
      <Button 
        variant="ghost" 
        onClick={onSearchClick}
        size="icon"
      >
        <Search className="h-5 w-5" />
      </Button>
    </header>
  );
};

export default Header;
