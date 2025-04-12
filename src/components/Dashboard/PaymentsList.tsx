
import React from 'react';
import { format } from 'date-fns';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { PaymentReminder } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { isAfter, isBefore, addDays } from 'date-fns';

interface PaymentsListProps {
  payments: PaymentReminder[];
  onMarkAsReceived: (paymentId: string) => void;
}

const PaymentsList: React.FC<PaymentsListProps> = ({ payments, onMarkAsReceived }) => {
  if (payments.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-lg">Payment Reminders</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-4">
            No pending payments
          </p>
        </CardContent>
      </Card>
    );
  }

  const today = new Date();
  const sortedPayments = [...payments].sort((a, b) => 
    a.dueDate.getTime() - b.dueDate.getTime()
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">Payment Reminders</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {sortedPayments.map((payment) => {
            const isDue = isAfter(today, payment.dueDate);
            const isWithinWeek = isBefore(payment.dueDate, addDays(today, 7));
            
            return (
              <div 
                key={payment.id} 
                className="flex items-center justify-between p-3 rounded-lg border"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    {isDue ? (
                      <AlertCircle className="h-4 w-4 text-red-500" />
                    ) : isWithinWeek ? (
                      <AlertCircle className="h-4 w-4 text-green-500" />
                    ) : null}
                    <span className="font-medium">{payment.projectName}</span>
                  </div>
                  <div className={`text-sm ${isDue ? 'text-red-500' : isWithinWeek ? 'text-green-600' : 'text-gray-500'}`}>
                    Due: {format(payment.dueDate, 'MMM d, yyyy')}
                  </div>
                  {payment.notes && (
                    <div className="text-xs text-gray-500 mt-1">
                      {payment.notes}
                    </div>
                  )}
                </div>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => onMarkAsReceived(payment.id)}
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Received
                </Button>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentsList;
