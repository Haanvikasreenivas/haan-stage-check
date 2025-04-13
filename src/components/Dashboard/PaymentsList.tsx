
import React from 'react';
import { format, formatDistanceToNow } from 'date-fns';
import { PaymentReminder } from '@/types';
import { Button } from '@/components/ui/button';

interface PaymentsListProps {
  payments: PaymentReminder[];
  onMarkAsReceived: (paymentId: string) => void;
}

const PaymentsList: React.FC<PaymentsListProps> = ({ payments, onMarkAsReceived }) => {
  return (
    <div className="space-y-4 animate-fade-in">
      <h3 className="text-lg font-medium">Pending Payments</h3>
      {payments.length === 0 ? (
        <p className="text-gray-500">No pending payments.</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {payments.map(payment => (
            <li key={payment.id} className="py-4">
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
                  {format(payment.dueDate, 'MMM d, yyyy')}
                </div>
                <div className="text-right">
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={() => onMarkAsReceived(payment.id)}
                  >
                    Mark as Received
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PaymentsList;
