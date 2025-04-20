
import React from 'react';
import { format, formatDistanceToNow } from 'date-fns';
import { PaymentReminder } from '@/types';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Clock, Calendar, DollarSign } from 'lucide-react';
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
    toast.success(`Payment for ${projectName} marked as received`, {
      icon: <CheckCircle2 className="h-4 w-4 text-green-500" />,
      position: "top-center",
    });
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
      <div className="flex items-center gap-2">
        <DollarSign className="h-5 w-5 text-green-500" />
        <h3 className="text-lg font-semibold">Pending Payments</h3>
      </div>
      
      {payments.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center border shadow-sm">
          <DollarSign className="h-12 w-12 mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">No pending payments</p>
          <p className="text-gray-400 text-sm mt-1">Payments will appear here when they're due</p>
        </div>
      ) : (
        <AnimatePresence>
          <ul className="divide-y divide-gray-100 rounded-xl border bg-white shadow-sm overflow-hidden">
            {payments.map((payment, index) => (
              <motion.li 
                key={payment.id} 
                className="py-4 px-4 hover:bg-blue-50 transition-colors relative overflow-hidden group"
                {...itemAnimation}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center relative">
                  <div>
                    <p className="text-base font-medium text-gray-900">{payment.projectName}</p>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <Clock className="h-3 w-3 mr-1 text-blue-500" />
                      <p>Due {formatDistanceToNow(payment.dueDate, { addSuffix: true })}</p>
                    </div>
                    {payment.notes && (
                      <p className="text-xs text-gray-600 mt-2 bg-gray-50 p-1.5 rounded border border-gray-100 inline-block">
                        {payment.notes}
                      </p>
                    )}
                  </div>
                  
                  <div className="text-sm text-gray-700 flex items-center">
                    <Calendar className="h-3.5 w-3.5 mr-1.5 text-blue-500" />
                    <span>
                      {format(payment.dueDate, 'MMM d, yyyy')} at {formatTo12HourTime(payment.dueDate)}
                    </span>
                  </div>
                  
                  <div className="text-right">
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={() => handleMarkAsReceived(payment.id, payment.projectName)}
                      className="group transition-all duration-300 bg-white hover:bg-green-50 hover:border-green-200"
                    >
                      <CheckCircle2 className="mr-2 h-4 w-4 text-gray-400 group-hover:text-green-500 transition-colors" />
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
