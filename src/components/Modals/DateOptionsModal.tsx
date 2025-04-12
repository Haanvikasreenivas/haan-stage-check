
import React from 'react';
import { format } from 'date-fns';
import { CalendarDay } from '@/types';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar, Edit, Trash, Check } from 'lucide-react';

interface DateOptionsModalProps {
  isOpen: boolean;
  calendarDay: CalendarDay | null;
  onClose: () => void;
  onEditProject: () => void;
  onCancelProject: () => void;
  onReblockProject: () => void;
}

const DateOptionsModal: React.FC<DateOptionsModalProps> = ({
  isOpen,
  calendarDay,
  onClose,
  onEditProject,
  onCancelProject,
  onReblockProject,
}) => {
  if (!calendarDay) return null;

  const { date, project } = calendarDay;
  const isBlocked = project?.status === 'blocked';
  const isCanceled = project?.status === 'canceled';

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md fade-in">
        <DialogHeader>
          <DialogTitle>
            {format(date, 'MMMM d, yyyy')}
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          {project && (
            <div className="mb-4">
              <h3 className="font-medium text-lg">{project.name}</h3>
              {project.notes && (
                <p className="text-sm text-muted-foreground mt-1">{project.notes}</p>
              )}
              <div className="mt-2 text-sm">
                Status: <span className={isCanceled ? 'text-gray-500' : 'text-blue-500'}>
                  {isCanceled ? 'Canceled' : 'Blocked'}
                </span>
              </div>
            </div>
          )}

          <div className="space-y-2">
            {isBlocked && (
              <>
                <Button 
                  variant="outline" 
                  className="w-full justify-start" 
                  onClick={onEditProject}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Details
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start" 
                  onClick={onCancelProject}
                >
                  <Trash className="mr-2 h-4 w-4" />
                  Cancel Date
                </Button>
              </>
            )}

            {isCanceled && (
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                onClick={onReblockProject}
              >
                <Check className="mr-2 h-4 w-4" />
                Re-block Date
              </Button>
            )}

            {!project && (
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                onClick={onEditProject}
              >
                <Calendar className="mr-2 h-4 w-4" />
                Block Date
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DateOptionsModal;
