
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Calendar, X } from 'lucide-react';
import { CalendarDay } from '@/types';
import { format } from 'date-fns';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  calendarDays: CalendarDay[];
  onDateSelect: (date: Date) => void;
}

const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  calendarDays,
  onDateSelect,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<CalendarDay[]>([]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setResults([]);
      return;
    }

    const filteredDays = calendarDays.filter(day => 
      day.project && 
      (day.project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       (day.project.notes && day.project.notes.toLowerCase().includes(searchTerm.toLowerCase())))
    );

    setResults(filteredDays);
  }, [searchTerm, calendarDays]);

  const handleDateSelect = (date: Date) => {
    onDateSelect(date);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            className="pl-10 py-6"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus
          />
          {searchTerm && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute right-1 top-1.5"
              onClick={() => setSearchTerm('')}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="mt-4 max-h-80 overflow-y-auto">
          {results.length === 0 && searchTerm.trim() !== '' ? (
            <div className="text-center py-8 text-muted-foreground">
              No projects found matching "{searchTerm}"
            </div>
          ) : (
            <div className="space-y-2">
              {results.map((day) => (
                <Button
                  key={format(day.date, 'yyyy-MM-dd')}
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => handleDateSelect(day.date)}
                >
                  <Calendar className="mr-2 h-4 w-4 text-blue-500" />
                  <div className="flex flex-col items-start">
                    <span className="font-medium">{day.project?.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {format(day.date, 'MMM d, yyyy')}
                    </span>
                  </div>
                </Button>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchModal;
