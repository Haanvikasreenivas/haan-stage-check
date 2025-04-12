
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import { Check, X } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

interface AddProjectModalProps {
  isOpen: boolean;
  date: Date | null;
  existingProject?: {
    id: string;
    name: string;
    notes?: string;
  };
  onClose: () => void;
  onSave: (project: {
    name: string;
    notes?: string;
    paymentReminder?: {
      timeValue: number;
      timeUnit: 'days' | 'weeks' | 'months';
      notes?: string;
    };
  }) => void;
}

const AddProjectModal: React.FC<AddProjectModalProps> = ({
  isOpen,
  date,
  existingProject,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState(existingProject?.name || '');
  const [notes, setNotes] = useState(existingProject?.notes || '');
  const [addPaymentReminder, setAddPaymentReminder] = useState(false);
  const [paymentTimeValue, setPaymentTimeValue] = useState<number>(15);
  const [paymentTimeUnit, setPaymentTimeUnit] = useState<'days' | 'weeks' | 'months'>('days');
  const [paymentNotes, setPaymentNotes] = useState('');

  if (!date) return null;

  const handleSave = () => {
    if (!name.trim()) return;

    const projectData = {
      name: name.trim(),
      notes: notes.trim() || undefined,
      paymentReminder: addPaymentReminder ? {
        timeValue: paymentTimeValue,
        timeUnit: paymentTimeUnit,
        notes: paymentNotes.trim() || undefined
      } : undefined
    };

    onSave(projectData);
    resetForm();
  };

  const resetForm = () => {
    setName('');
    setNotes('');
    setAddPaymentReminder(false);
    setPaymentTimeValue(15);
    setPaymentTimeUnit('days');
    setPaymentNotes('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md fade-in">
        <DialogHeader>
          <DialogTitle>
            {existingProject ? 'Edit Project' : 'Add Project'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="text-sm text-muted-foreground mb-4">
            Date: {date ? format(date, 'MMMM d, yyyy') : ''}
          </div>

          <div className="space-y-2">
            <Label htmlFor="project-name">Project Name</Label>
            <Input
              id="project-name"
              placeholder="e.g., Event Gala"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="project-notes">Notes (Optional)</Label>
            <Textarea
              id="project-notes"
              placeholder="Studio 5, 10 AM"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="col-span-3"
            />
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <Switch
              id="add-payment"
              checked={addPaymentReminder}
              onCheckedChange={setAddPaymentReminder}
            />
            <Label htmlFor="add-payment">Add payment reminder</Label>
          </div>

          {addPaymentReminder && (
            <div className="space-y-4 pt-2 pl-2 border-l-2 border-blue-100">
              <div className="flex items-center gap-2">
                <div className="w-20">
                  <Input
                    type="number"
                    value={paymentTimeValue}
                    onChange={(e) => setPaymentTimeValue(parseInt(e.target.value) || 15)}
                    min={1}
                  />
                </div>
                <Select
                  value={paymentTimeUnit}
                  onValueChange={(value: any) => setPaymentTimeUnit(value)}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="days">Days</SelectItem>
                    <SelectItem value="weeks">Weeks</SelectItem>
                    <SelectItem value="months">Months</SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-sm text-muted-foreground">after shoot</span>
              </div>

              <div className="space-y-2">
                <Label htmlFor="payment-notes">Payment Notes (Optional)</Label>
                <Textarea
                  id="payment-notes"
                  placeholder="e.g., Call Priya for payout"
                  value={paymentNotes}
                  onChange={(e) => setPaymentNotes(e.target.value)}
                />
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex justify-between sm:justify-between">
          <Button variant="outline" onClick={onClose}>
            <X className="mr-1 h-4 w-4" />
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!name.trim()}>
            <Check className="mr-1 h-4 w-4" />
            {existingProject ? 'Update' : 'Block Date'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddProjectModal;
