
import React from 'react';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ShootStatusReminder } from '@/types';
import { CheckCircle, XCircle } from 'lucide-react';

interface ShootStatusModalProps {
  isOpen: boolean;
  reminder: ShootStatusReminder | null;
  onClose: () => void;
  onConfirmShoot: () => void;
  onConfirmNoShoot: () => void;
}

const ShootStatusModal: React.FC<ShootStatusModalProps> = ({
  isOpen,
  reminder,
  onClose,
  onConfirmShoot,
  onConfirmNoShoot,
}) => {
  if (!reminder) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl mb-2">
            Haanvika, {format(reminder.date, 'MMM d')}: Shoot or No Shoot?
          </DialogTitle>
        </DialogHeader>

        <div className="py-8 text-center">
          <p className="text-lg mb-6">
            You have a canceled date. Is this still a shoot day?
          </p>

          <div className="flex gap-4 justify-center">
            <Button
              size="lg"
              className="flex-1 h-14 max-w-36"
              onClick={onConfirmShoot}
            >
              <CheckCircle className="mr-2 h-5 w-5" />
              Shoot
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              className="flex-1 h-14 max-w-36"
              onClick={onConfirmNoShoot}
            >
              <XCircle className="mr-2 h-5 w-5" />
              No Shoot
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShootStatusModal;
