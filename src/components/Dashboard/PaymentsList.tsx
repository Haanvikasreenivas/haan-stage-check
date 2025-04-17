
import React from 'react';
import { format, formatDistanceToNow } from 'date-fns';
import { PaymentReminder } from '@/types';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { useAnimations } from '@/contexts/AnimationContext';
import { toast } from 'sonner';

interface PaymentsListProps {
  payments: PaymentReminder[];
  onMarkAsReceived: (paymentId: string) => void;
}

const PaymentsList: React.FC<PaymentsListProps> = ({ payments, onMarkAsReceived }) => {
  const { animationsEnabled } = useAnimations();
  
  // Function to format time to 12-hour format with AM/PM
  const formatTo12HourTime = (date: Date) => {
    return format(date, 'h:mm a'); // This will format to 12-hour time with AM/PM
  };

  const handleMarkAsReceived = (paymentId: string, projectName: string) => {
    onMarkAsReceived(paymentId);
    toast.success(`Payment for ${projectName} marked as received`);
  };

  // Animation properties based on user preferences
  const containerAnimation = animationsEnabled ? {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3 }
  } : {};

  const itemAnimation = animationsEnabled ? {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, x: -10 },
    whileHover: { backgroundColor: 'rgba(249, 250, 251, 0.8)' }
  } : {};

  return (
    <motion.div 
      className="space-y-4"
      {...containerAnimation}
    >
      <h3 className="text-lg font-medium">Pending Payments</h3>
      {payments.length === 0 ? (
        <p className="text-gray-500">No pending payments.</p>
      ) : (
        <AnimatePresence>
          <ul className="divide-y divide-gray-200 rounded-xl border">
            {payments.map((payment, index) => (
              <motion.li 
                key={payment.id} 
                className="py-4 px-4 hover:bg-gray-50 transition-colors"
                {...itemAnimation}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{payment.projectName}</p>
                    <p className="text-sm text-gray-500">
                      Due {formatDistanceToNow(payment.dueDate, { addSuffix: true })}
                    </p>
                    {payment.notes && (
                      <p className="text-xs text-gray-600 mt-1">
                        Note: {payment.notes}
                      </p>
                    )}
                  </div>
                  <div className="text-sm text-gray-700">
                    {format(payment.dueDate, 'MMM d, yyyy')} at {formatTo12HourTime(payment.dueDate)}
                  </div>
                  <div className="text-right">
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={() => handleMarkAsReceived(payment.id, payment.projectName)}
                      className="group transition-all duration-300"
                    >
                      <CheckCircle className="mr-2 h-4 w-4 text-gray-400 group-hover:text-green-500 transition-colors" />
                      <span>Mark as Received</span>
                    </Button>
                  </div>
                </div>
              </motion.li>
            ))}
          </ul>
        </AnimatePresence>
      )}
    </motion.div>
  );
};

export default PaymentsList;
