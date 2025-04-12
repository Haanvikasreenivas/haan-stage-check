
import { useState, useEffect } from 'react';
import { CalendarDay, Project, PaymentReminder, ShootStatusReminder } from '@/types';
import { endOfMonth, startOfMonth, eachDayOfInterval, format, addDays, addWeeks, addMonths } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';

// Local storage keys
const PROJECTS_STORAGE_KEY = 'haan-projects';
const PAYMENTS_STORAGE_KEY = 'haan-payments';
const REMINDERS_STORAGE_KEY = 'haan-reminders';

export const useCalendarData = (currentMonth: Date) => {
  const [projects, setProjects] = useState<{ [date: string]: Project }>({});
  const [payments, setPayments] = useState<PaymentReminder[]>([]);
  const [reminders, setReminders] = useState<ShootStatusReminder[]>([]);
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([]);

  // Load data from local storage
  useEffect(() => {
    const storedProjects = localStorage.getItem(PROJECTS_STORAGE_KEY);
    const storedPayments = localStorage.getItem(PAYMENTS_STORAGE_KEY);
    const storedReminders = localStorage.getItem(REMINDERS_STORAGE_KEY);

    if (storedProjects) {
      setProjects(JSON.parse(storedProjects));
    }

    if (storedPayments) {
      setPayments(JSON.parse(storedPayments).map((payment: any) => ({
        ...payment,
        dueDate: new Date(payment.dueDate)
      })));
    }

    if (storedReminders) {
      setReminders(JSON.parse(storedReminders).map((reminder: any) => ({
        ...reminder,
        date: new Date(reminder.date)
      })));
    }
  }, []);

  // Save data to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem(PAYMENTS_STORAGE_KEY, JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    localStorage.setItem(REMINDERS_STORAGE_KEY, JSON.stringify(reminders));
  }, [reminders]);

  // Generate calendar days for the current month
  useEffect(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    const days = eachDayOfInterval({ start, end });

    const newCalendarDays = days.map((day) => {
      const dateStr = format(day, 'yyyy-MM-dd');
      const project = projects[dateStr];
      
      return {
        date: day,
        project
      };
    });

    setCalendarDays(newCalendarDays);
  }, [currentMonth, projects]);

  // Add or update a project
  const addProject = (date: Date, projectData: {
    name: string;
    notes?: string;
    paymentReminder?: {
      timeValue: number;
      timeUnit: 'days' | 'weeks' | 'months';
      notes?: string;
    };
  }) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const projectId = uuidv4();
    
    const newProject: Project = {
      id: projectId,
      name: projectData.name,
      notes: projectData.notes,
      status: 'blocked'
    };

    setProjects(prev => ({
      ...prev,
      [dateStr]: newProject
    }));

    // Add payment reminder if specified
    if (projectData.paymentReminder) {
      const { timeValue, timeUnit, notes } = projectData.paymentReminder;
      
      let dueDate = date;
      if (timeUnit === 'days') {
        dueDate = addDays(date, timeValue);
      } else if (timeUnit === 'weeks') {
        dueDate = addWeeks(date, timeValue);
      } else if (timeUnit === 'months') {
        dueDate = addMonths(date, timeValue);
      }

      const newPayment: PaymentReminder = {
        id: uuidv4(),
        projectId,
        projectName: projectData.name,
        dueDate,
        notes,
        status: 'pending'
      };

      setPayments(prev => [...prev, newPayment]);
    }

    return projectId;
  };

  // Edit an existing project
  const editProject = (date: Date, projectId: string, projectData: {
    name: string;
    notes?: string;
  }) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const currentProject = projects[dateStr];

    if (!currentProject) return;

    const updatedProject = {
      ...currentProject,
      name: projectData.name,
      notes: projectData.notes
    };

    setProjects(prev => ({
      ...prev,
      [dateStr]: updatedProject
    }));

    // Update associated payment if it exists
    setPayments(prev => 
      prev.map(payment => 
        payment.projectId === projectId
          ? { ...payment, projectName: projectData.name }
          : payment
      )
    );
  };

  // Cancel a project
  const cancelProject = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const currentProject = projects[dateStr];

    if (!currentProject) return;

    const updatedProject = {
      ...currentProject,
      status: 'canceled' as const
    };

    setProjects(prev => ({
      ...prev,
      [dateStr]: updatedProject
    }));

    // Add a shoot status reminder
    const newReminder: ShootStatusReminder = {
      id: uuidv4(),
      projectId: currentProject.id,
      date,
      responded: false
    };

    setReminders(prev => [...prev, newReminder]);
  };

  // Re-block a canceled project
  const reblockProject = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const currentProject = projects[dateStr];

    if (!currentProject) return;

    const updatedProject = {
      ...currentProject,
      status: 'blocked' as const
    };

    setProjects(prev => ({
      ...prev,
      [dateStr]: updatedProject
    }));

    // Remove any associated reminders
    setReminders(prev => 
      prev.filter(reminder => 
        !(format(reminder.date, 'yyyy-MM-dd') === dateStr && 
          reminder.projectId === currentProject.id)
      )
    );
  };

  // Mark a payment as received
  const markPaymentReceived = (paymentId: string) => {
    setPayments(prev => 
      prev.filter(payment => payment.id !== paymentId)
    );
  };

  // Confirm shoot status
  const confirmShootStatus = (reminder: ShootStatusReminder, isShoot: boolean) => {
    const dateStr = format(reminder.date, 'yyyy-MM-dd');
    
    if (isShoot) {
      // Re-block the date
      const currentProject = projects[dateStr];
      if (currentProject) {
        const updatedProject = {
          ...currentProject,
          status: 'blocked' as const
        };
        
        setProjects(prev => ({
          ...prev,
          [dateStr]: updatedProject
        }));
      }
    }
    
    // Remove the reminder
    setReminders(prev => 
      prev.filter(r => r.id !== reminder.id)
    );
  };

  return {
    calendarDays,
    projects,
    payments,
    reminders,
    addProject,
    editProject,
    cancelProject,
    reblockProject,
    markPaymentReceived,
    confirmShootStatus
  };
};
