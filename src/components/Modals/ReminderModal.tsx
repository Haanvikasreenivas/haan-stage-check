
import React, { useState } from 'react';
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
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Project } from '@/types';
import { Bell } from 'lucide-react';

interface ReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  onSave: (reminder: {
    title: string;
    date: Date;
    time: string;
    projectId?: string;
    notes?: string;
  }) => void;
}

const ReminderModal: React.FC<ReminderModalProps> = ({
  isOpen,
  onClose,
  projects,
  onSave,
}) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState(format(new Date(), 'HH:mm'));
  const [selectedProjectId, setSelectedProjectId] = useState<string | undefined>();
  const [notes, setNotes] = useState('');

  const handleSubmit = () => {
    if (!title.trim() || !date) return;
    
    onSave({
      title: title.trim(),
      date,
      time,
      projectId: selectedProjectId,
      notes: notes.trim() || undefined
    });
    
    // Reset form
    setTitle('');
    setDate(new Date());
    setTime(format(new Date(), 'HH:mm'));
    setSelectedProjectId(undefined);
    setNotes('');
    
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md animate-fade-in rounded-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Set Reminder
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="reminder-title">Reminder Title</Label>
            <Input
              id="reminder-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Call client"
              className="animate-fade-in"
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label>Date</Label>
            <div className="border rounded-lg overflow-hidden">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="p-3 pointer-events-auto animate-fade-in rounded-lg"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reminder-time">Time</Label>
            <Input
              id="reminder-time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="animate-fade-in"
            />
          </div>

          {projects.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="project">Link to Project (Optional)</Label>
              <select
                id="project"
                value={selectedProjectId || ''}
                onChange={(e) => setSelectedProjectId(e.target.value || undefined)}
                className="w-full p-2 border rounded-lg"
              >
                <option value="">None</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="reminder-notes">Notes (Optional)</Label>
            <Input
              id="reminder-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Additional details..."
              className="animate-fade-in"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="rounded-full">
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={!title.trim() || !date}
            className="rounded-full animate-fade-in"
          >
            Save Reminder
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReminderModal;
