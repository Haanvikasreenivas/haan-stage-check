
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Project } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Predefined color palette
const colorPalette = [
  '#000000', // Black
  '#3B82F6', // Blue
  '#10B981', // Green
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#06B6D4', // Cyan
  '#6B7280', // Gray
  '#1F2937', // Dark Gray
];

// Time options for select dropdown
const timeOptions = [
  "12:00 AM", "1:00 AM", "2:00 AM", "3:00 AM", "4:00 AM", "5:00 AM", "6:00 AM", 
  "7:00 AM", "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM",
  "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM",
  "7:00 PM", "8:00 PM", "9:00 PM", "10:00 PM", "11:00 PM"
];

interface ProjectCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: Date | null;
  existingProject?: Project;
  selectedDates?: Date[];
  onSave: (projectData: {
    name: string;
    notes?: string;
    color: string;
    selectedDates: Date[];
    paymentReminder?: {
      timeValue: number;
      timeUnit: 'days' | 'weeks' | 'months';
      notes?: string;
      dueDate?: Date;
      dueTime?: string;
    };
  }) => void;
}

const ProjectCardModal: React.FC<ProjectCardModalProps> = ({
  isOpen,
  onClose,
  date,
  existingProject,
  selectedDates = [],
  onSave,
}) => {
  const { toast } = useToast();
  const [name, setName] = useState(existingProject?.name || '');
  const [notes, setNotes] = useState(existingProject?.notes || '');
  const [color, setColor] = useState(existingProject?.color || colorPalette[0]);
  const [selectedDateArray, setSelectedDateArray] = useState<Date[]>(
    selectedDates.length > 0 ? selectedDates : date ? [date] : []
  );
  
  // Payment reminder states with calendar/time selection
  const [includePaymentReminder, setIncludePaymentReminder] = useState(false);
  const [paymentDueDate, setPaymentDueDate] = useState<Date | undefined>(undefined);
  const [paymentDueTime, setPaymentDueTime] = useState('10:00 AM');
  const [paymentNotes, setPaymentNotes] = useState('');
  
  // Convert 12-hour time to 24-hour format for internal use
  const convertTo24Hour = (time12h: string): string => {
    const [timePart, modifier] = time12h.split(' ');
    let [hours, minutes] = timePart.split(':').map(Number);
    
    if (hours === 12) {
      hours = modifier === 'PM' ? 12 : 0;
    } else if (modifier === 'PM') {
      hours += 12;
    }
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  const handleDateSelect = (dates: Date[] | undefined) => {
    if (!dates) return;
    setSelectedDateArray(dates);
  };

  const handleSubmit = () => {
    if (!name.trim()) return;
    
    const projectData = {
      name,
      notes,
      color,
      selectedDates: selectedDateArray,
      ...(includePaymentReminder && paymentDueDate ? {
        paymentReminder: {
          timeValue: 1,
          timeUnit: 'days' as const,
          notes: paymentNotes,
          dueDate: paymentDueDate,
          dueTime: convertTo24Hour(paymentDueTime) // Convert to 24-hour format for storage
        }
      } : {})
    };
    
    onSave(projectData);
    
    // Show toast with fade out animation
    toast({
      title: "Dates blocked!",
      description: `${name} has been added to ${selectedDateArray.length} dates.`,
      className: "animate-fade-in",
      duration: 2000, // 2 seconds as requested
    });
  };

  if (!date && selectedDateArray.length === 0) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto animate-fade-in">
        <DialogHeader>
          <DialogTitle>
            {existingProject ? 'Edit Project' : 'Block Dates'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Project Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter project name"
              className="animate-fade-in"
            />
          </div>

          <div className="space-y-2">
            <Label>Color</Label>
            <div className="flex flex-wrap gap-2">
              {colorPalette.map((paletteColor) => (
                <button
                  key={paletteColor}
                  type="button"
                  className={`w-8 h-8 rounded-full transition-transform ${
                    color === paletteColor ? 'ring-2 ring-primary ring-offset-2 scale-110' : ''
                  } hover:scale-105`}
                  style={{ backgroundColor: paletteColor }}
                  onClick={() => setColor(paletteColor)}
                  aria-label={`Select color ${paletteColor}`}
                />
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes here"
              className="resize-none animate-fade-in"
            />
          </div>

          <div className="space-y-2">
            <Label>Selected Dates</Label>
            <div className="text-sm">
              {selectedDateArray.length > 0 
                ? selectedDateArray.map(d => format(d, 'MMM d, yyyy')).join(', ')
                : 'No dates selected'}
            </div>
            
            <div className="border rounded-md p-2 mt-2">
              <Calendar
                mode="multiple"
                selected={selectedDateArray}
                onSelect={handleDateSelect}
                className="w-full pointer-events-auto animate-fade-in"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="payment-reminder"
                checked={includePaymentReminder}
                onChange={(e) => setIncludePaymentReminder(e.target.checked)}
                className="rounded border-gray-300"
              />
              <Label htmlFor="payment-reminder">Set Payment Reminder</Label>
            </div>
            
            {includePaymentReminder && (
              <div className="pl-6 space-y-3 animate-fade-in">
                <div className="space-y-2">
                  <Label htmlFor="payment-date">Payment Due Date</Label>
                  <div className="border rounded-md p-2">
                    <Calendar
                      mode="single"
                      selected={paymentDueDate}
                      onSelect={setPaymentDueDate}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="payment-time">Payment Due Time</Label>
                  <Select 
                    value={paymentDueTime} 
                    onValueChange={setPaymentDueTime}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeOptions.map(time => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="payment-notes">Payment Notes (Optional)</Label>
                  <Textarea
                    id="payment-notes"
                    value={paymentNotes}
                    onChange={(e) => setPaymentNotes(e.target.value)}
                    placeholder="Add payment notes"
                    className="resize-none"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="hover:bg-gray-100 transition-colors">
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={!name.trim() || selectedDateArray.length === 0}
            className="hover:bg-primary/90 transition-colors animate-fade-in"
          >
            {existingProject ? 'Update' : 'Block Dates'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectCardModal;
