
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
import { toast } from 'sonner';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Clock, Plus, Minus, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useAnimations } from '@/contexts/AnimationContext';

// Predefined color palette - updated with more vibrant colors
const colorPalette = [
  '#3B82F6', // Blue
  '#10B981', // Green
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#06B6D4', // Cyan
  '#000000', // Black
  '#6B7280', // Gray
  '#F97316', // Orange
];

// Quick time options
const quickTimeOptions = [
  { label: "Now", value: "now" },
  { label: "+1 Hour", value: "plus1" },
  { label: "Morning", value: "9:00 AM" },
  { label: "Noon", value: "12:00 PM" },
  { label: "Evening", value: "6:00 PM" }
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
  const { animationsEnabled } = useAnimations();
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
      try {
        const timeMatch = paymentDueTime.match(/(\d+):(\d+)\s(AM|PM)/i);
        if (timeMatch) {
          const [_, hourStr, minuteStr, periodStr] = timeMatch;
          setHours(parseInt(hourStr, 10));
          setMinutes(parseInt(minuteStr, 10));
          setPeriod(periodStr.toUpperCase() as 'AM' | 'PM');
        }
      } catch (error) {
        console.error("Error parsing time:", error);
      }
    }
  }, [paymentDueTime]);

  // Update time string when time components change
  useEffect(() => {
    try {
      // Hours in 12-hour format should be 1-12, never 0
      const formattedHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
      const formattedTime = `${formattedHours}:${minutes.toString().padStart(2, '0')} ${period}`;
      setPaymentDueTime(formattedTime);
    } catch (error) {
      console.error("Error formatting time:", error);
    }
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
    } else if (option === '9:00 AM') {
      setHours(9);
      setMinutes(0);
      setPeriod('AM');
    } else if (option === '12:00 PM') {
      setHours(12);
      setMinutes(0);
      setPeriod('PM');
    } else if (option === '6:00 PM') {
      setHours(6);
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
    
    // Show toast with improved animation
    toast.success(`${selectedDateArray.length} dates blocked for ${name}`, { 
      duration: 2000,
      icon: <CheckCircle2 className="h-4 w-4 text-green-500" />,
      position: "top-center"
    });
  };

  if (!date && selectedDateArray.length === 0) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto animate-fade-in">
        <DialogHeader>
          <DialogTitle className="text-xl">
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
            <Label htmlFor="name" className="text-sm font-medium">Project Name</Label>
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
            <Label className="text-sm font-medium">Project Color</Label>
            <div className="flex flex-wrap gap-3 py-2">
              {colorPalette.map((paletteColor) => (
                <motion.button
                  key={paletteColor}
                  type="button"
                  className={`w-10 h-10 rounded-full transition-all duration-200 ${
                    color === paletteColor ? 'ring-4 ring-primary/30 ring-offset-2 scale-110' : ''
                  } hover:scale-105 shadow-sm`}
                  style={{ backgroundColor: paletteColor }}
                  onClick={() => setColor(paletteColor)}
                  aria-label={`Select color ${paletteColor}`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {color === paletteColor && (
                    <motion.span 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="flex items-center justify-center"
                    >
                      <CheckCircle2 className={`h-5 w-5 ${paletteColor === '#FFFFFF' ? 'text-black' : 'text-white'}`} />
                    </motion.span>
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>

          <motion.div 
            className="space-y-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Label htmlFor="notes" className="text-sm font-medium">Notes (Optional)</Label>
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
            <Label className="text-sm font-medium">Selected Dates</Label>
            <div className="text-sm bg-gray-50 p-2 rounded-md border border-gray-100">
              {selectedDateArray.length > 0 
                ? selectedDateArray.map(d => format(d, 'MMM d, yyyy')).join(', ')
                : 'No dates selected'}
            </div>
            
            <div className="border rounded-md p-2 mt-2 bg-white shadow-sm">
              <Calendar
                mode="multiple"
                selected={selectedDateArray}
                onSelect={handleDateSelect}
                className="w-full pointer-events-auto animate-fade-in"
              />
            </div>
          </motion.div>

          <motion.div 
            className="space-y-2 pt-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center space-x-2 bg-blue-50 p-3 rounded-md border border-blue-100">
              <input
                type="checkbox"
                id="payment-reminder"
                checked={includePaymentReminder}
                onChange={(e) => setIncludePaymentReminder(e.target.checked)}
                className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
              />
              <Label htmlFor="payment-reminder" className="font-medium text-blue-700">Set Payment Reminder</Label>
            </div>
            
            <AnimatePresence>
              {includePaymentReminder && (
                <motion.div 
                  className="pl-6 space-y-4 border-l-2 border-blue-200 mt-3"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="space-y-2">
                    <Label htmlFor="payment-date" className="text-sm font-medium">Payment Due Date</Label>
                    <div className="border rounded-md p-2 bg-white shadow-sm">
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
                    <Label htmlFor="payment-time" className="text-sm font-medium">Payment Due Time</Label>
                    <Popover open={isTimePickerOpen} onOpenChange={setIsTimePickerOpen}>
                      <PopoverTrigger asChild>
                        <Button 
                          variant="outline" 
                          className="w-full flex justify-between items-center bg-white"
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
                          
                          <div className="flex justify-center items-center gap-2 bg-blue-50 rounded-xl p-4">
                            {/* Hour selector */}
                            <div className="flex flex-col items-center">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={incrementHour}
                                className="rounded-full w-8 h-8 p-0 flex items-center justify-center bg-white"
                              >
                                <Plus size={16} />
                              </Button>
                              <div className="text-2xl font-bold w-12 text-center my-2">
                                {hours.toString().padStart(2, '0')}
                              </div>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={decrementHour}
                                className="rounded-full w-8 h-8 p-0 flex items-center justify-center bg-white"
                              >
                                <Minus size={16} />
                              </Button>
                            </div>
                            
                            <div className="text-2xl font-bold">:</div>
                            
                            {/* Minute selector */}
                            <div className="flex flex-col items-center">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={incrementMinute}
                                className="rounded-full w-8 h-8 p-0 flex items-center justify-center bg-white"
                              >
                                <Plus size={16} />
                              </Button>
                              <div className="text-2xl font-bold w-12 text-center my-2">
                                {minutes.toString().padStart(2, '0')}
                              </div>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={decrementMinute}
                                className="rounded-full w-8 h-8 p-0 flex items-center justify-center bg-white"
                              >
                                <Minus size={16} />
                              </Button>
                            </div>
                            
                            {/* AM/PM selector */}
                            <div className="flex flex-col items-center ml-2">
                              <Button 
                                variant={period === 'AM' ? "default" : "outline"} 
                                size="sm" 
                                onClick={() => setPeriod('AM')}
                                className={`px-3 mb-1 transition-all duration-200 ${period === 'AM' ? 'shadow-md' : 'bg-white'}`}
                              >
                                AM
                              </Button>
                              <Button 
                                variant={period === 'PM' ? "default" : "outline"} 
                                size="sm" 
                                onClick={() => setPeriod('PM')}
                                className={`px-3 transition-all duration-200 ${period === 'PM' ? 'shadow-md' : 'bg-white'}`}
                              >
                                PM
                              </Button>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-2 pt-2">
                            {quickTimeOptions.map(option => (
                              <Button 
                                key={option.value}
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleQuickTimeOption(option.value)}
                                className="w-full bg-white"
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
                    <Label htmlFor="payment-notes" className="text-sm font-medium">Payment Notes (Optional)</Label>
                    <Textarea
                      id="payment-notes"
                      value={paymentNotes}
                      onChange={(e) => setPaymentNotes(e.target.value)}
                      placeholder="Add payment notes"
                      className="resize-none bg-white"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose} className="hover:bg-gray-100 transition-colors">
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={!name.trim() || selectedDateArray.length === 0}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg"
          >
            {existingProject ? 'Update Project' : 'Block Dates'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectCardModal;
