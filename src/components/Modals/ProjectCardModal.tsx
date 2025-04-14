
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Project } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Clock, Plus, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';

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

// Quick time options
const quickTimeOptions = [
  { label: "Now", value: "now" },
  { label: "+1 Hour", value: "plus1" },
  { label: "10:00 AM", value: "10:00 AM" },
  { label: "2:00 PM", value: "2:00 PM" }
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
  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);
  
  // Time picker states
  const [hours, setHours] = useState(10);
  const [minutes, setMinutes] = useState(0);
  const [period, setPeriod] = useState<'AM' | 'PM'>('AM');
  
  // Parse existing time when component mounts
  useEffect(() => {
    if (paymentDueTime) {
      const timeMatch = paymentDueTime.match(/(\d+):(\d+)\s(AM|PM)/i);
      if (timeMatch) {
        const [_, hourStr, minuteStr, periodStr] = timeMatch;
        setHours(parseInt(hourStr, 10));
        setMinutes(parseInt(minuteStr, 10));
        setPeriod(periodStr.toUpperCase() as 'AM' | 'PM');
      }
    }
  }, [paymentDueTime]);

  // Update time string when time components change
  useEffect(() => {
    const formattedHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
    const formattedTime = `${formattedHours}:${minutes.toString().padStart(2, '0')} ${period}`;
    setPaymentDueTime(formattedTime);
  }, [hours, minutes, period]);

  const handleDateSelect = (dates: Date[] | undefined) => {
    if (!dates) return;
    setSelectedDateArray(dates);
  };

  const handleQuickTimeOption = (option: string) => {
    const now = new Date();
    
    if (option === 'now') {
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      setHours(currentHour > 12 ? currentHour - 12 : currentHour === 0 ? 12 : currentHour);
      setMinutes(Math.floor(currentMinute / 5) * 5); // Round to nearest 5 minutes
      setPeriod(now.getHours() >= 12 ? 'PM' : 'AM');
    } else if (option === 'plus1') {
      const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
      const hourLater = oneHourLater.getHours();
      setHours(hourLater > 12 ? hourLater - 12 : hourLater === 0 ? 12 : hourLater);
      setMinutes(Math.floor(now.getMinutes() / 5) * 5); // Round to nearest 5 minutes
      setPeriod(oneHourLater.getHours() >= 12 ? 'PM' : 'AM');
    } else if (option === '10:00 AM') {
      setHours(10);
      setMinutes(0);
      setPeriod('AM');
    } else if (option === '2:00 PM') {
      setHours(2);
      setMinutes(0);
      setPeriod('PM');
    }
    
    setIsTimePickerOpen(false);
  };

  const incrementHour = () => {
    if (hours === 12) {
      setHours(1);
    } else {
      setHours(prev => prev + 1);
    }
  };

  const decrementHour = () => {
    if (hours === 1) {
      setHours(12);
    } else {
      setHours(prev => prev - 1);
    }
  };

  const incrementMinute = () => {
    if (minutes === 55) {
      setMinutes(0);
      incrementHour();
    } else {
      setMinutes(prev => prev + 5);
    }
  };

  const decrementMinute = () => {
    if (minutes === 0) {
      setMinutes(55);
      decrementHour();
    } else {
      setMinutes(prev => prev - 5);
    }
  };

  const togglePeriod = () => {
    setPeriod(prev => prev === 'AM' ? 'PM' : 'AM');
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
          dueTime: paymentDueTime
        }
      } : {})
    };
    
    onSave(projectData);
    
    // Show toast with fade out animation
    toast({
      title: "Dates blocked!",
      description: `${name} has been added to ${selectedDateArray.length} dates.`,
      className: "animate-fade-in",
      duration: 2000, 
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
          <DialogDescription>
            {existingProject ? 'Edit project details' : 'Create a new project and block dates'}
          </DialogDescription>
        </DialogHeader>

        <motion.div 
          className="space-y-4 py-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
        >
          <motion.div 
            className="space-y-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Label htmlFor="name">Project Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter project name"
              className="animate-fade-in"
            />
          </motion.div>

          <motion.div 
            className="space-y-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Label>Color</Label>
            <div className="flex flex-wrap gap-2">
              {colorPalette.map((paletteColor) => (
                <motion.button
                  key={paletteColor}
                  type="button"
                  className={`w-8 h-8 rounded-full transition-transform ${
                    color === paletteColor ? 'ring-2 ring-primary ring-offset-2 scale-110' : ''
                  } hover:scale-105`}
                  style={{ backgroundColor: paletteColor }}
                  onClick={() => setColor(paletteColor)}
                  aria-label={`Select color ${paletteColor}`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                />
              ))}
            </div>
          </motion.div>

          <motion.div 
            className="space-y-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes here"
              className="resize-none animate-fade-in"
            />
          </motion.div>

          <motion.div 
            className="space-y-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
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
          </motion.div>

          <motion.div 
            className="space-y-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
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
            
            <AnimatePresence>
              {includePaymentReminder && (
                <motion.div 
                  className="pl-6 space-y-3"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
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
                    <Popover open={isTimePickerOpen} onOpenChange={setIsTimePickerOpen}>
                      <PopoverTrigger asChild>
                        <Button 
                          variant="outline" 
                          className="w-full flex justify-between items-center"
                          onClick={() => setIsTimePickerOpen(true)}
                        >
                          <span>{paymentDueTime}</span>
                          <Clock className="h-4 w-4 opacity-70" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80 p-0" align="start">
                        <div className="p-4 space-y-4">
                          <div className="flex justify-between items-center">
                            <h4 className="font-medium">Select Time</h4>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => setIsTimePickerOpen(false)}
                            >
                              Done
                            </Button>
                          </div>
                          
                          <div className="flex justify-center items-center gap-2">
                            {/* Hour selector */}
                            <div className="flex flex-col items-center">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={incrementHour}
                                className="px-2"
                              >
                                <Plus size={16} />
                              </Button>
                              <div className="text-2xl font-bold w-12 text-center">
                                {hours.toString().padStart(2, '0')}
                              </div>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={decrementHour}
                                className="px-2"
                              >
                                <Minus size={16} />
                              </Button>
                            </div>
                            
                            <div className="text-2xl font-bold">:</div>
                            
                            {/* Minute selector */}
                            <div className="flex flex-col items-center">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={incrementMinute}
                                className="px-2"
                              >
                                <Plus size={16} />
                              </Button>
                              <div className="text-2xl font-bold w-12 text-center">
                                {minutes.toString().padStart(2, '0')}
                              </div>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={decrementMinute}
                                className="px-2"
                              >
                                <Minus size={16} />
                              </Button>
                            </div>
                            
                            {/* AM/PM selector */}
                            <div className="flex flex-col items-center">
                              <Button 
                                variant={period === 'AM' ? "default" : "outline"} 
                                size="sm" 
                                onClick={() => setPeriod('AM')}
                                className="px-2 mb-1"
                              >
                                AM
                              </Button>
                              <Button 
                                variant={period === 'PM' ? "default" : "outline"} 
                                size="sm" 
                                onClick={() => setPeriod('PM')}
                                className="px-2"
                              >
                                PM
                              </Button>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2 pt-2">
                            {quickTimeOptions.map(option => (
                              <Button 
                                key={option.value}
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleQuickTimeOption(option.value)}
                                className="w-full"
                              >
                                {option.label}
                              </Button>
                            ))}
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
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
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>

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
