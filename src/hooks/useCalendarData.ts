
import { useState, useEffect, useCallback } from 'react';
import { CalendarDay, Project, PaymentReminder, ShootStatusReminder, UserProfile } from '@/types';
import { endOfMonth, startOfMonth, eachDayOfInterval, format, addDays, addWeeks, addMonths, parseISO, isValid } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

// Local storage keys
const PROJECTS_STORAGE_KEY = 'haan-projects';
const PAYMENTS_STORAGE_KEY = 'haan-payments';
const REMINDERS_STORAGE_KEY = 'haan-reminders';
const PROFILE_STORAGE_KEY = 'haan-profile';

export const useCalendarData = (currentMonth: Date) => {
  const [projects, setProjects] = useState<{ [date: string]: Project }>({});
  const [payments, setPayments] = useState<PaymentReminder[]>([]);
  const [reminders, setReminders] = useState<ShootStatusReminder[]>([]);
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([]);
  const [profile, setProfile] = useState<UserProfile>({ name: '' });

  // Helper function to ensure valid dates from localStorage
  const ensureValidDate = (dateStr: string): Date => {
    try {
      const parsedDate = parseISO(dateStr);
      return isValid(parsedDate) ? parsedDate : new Date();
    } catch (e) {
      console.error("Invalid date:", dateStr);
      return new Date();
    }
  };

  // Load data from local storage
  useEffect(() => {
    const storedProjects = localStorage.getItem(PROJECTS_STORAGE_KEY);
    const storedPayments = localStorage.getItem(PAYMENTS_STORAGE_KEY);
    const storedReminders = localStorage.getItem(REMINDERS_STORAGE_KEY);
    const storedProfile = localStorage.getItem(PROFILE_STORAGE_KEY);

    if (storedProjects) {
      setProjects(JSON.parse(storedProjects));
    }

    if (storedPayments) {
      try {
        setPayments(JSON.parse(storedPayments).map((payment: any) => ({
          ...payment,
          dueDate: ensureValidDate(payment.dueDate)
        })));
      } catch (error) {
        console.error("Error parsing payments:", error);
        setPayments([]);
      }
    }

    if (storedReminders) {
      try {
        setReminders(JSON.parse(storedReminders).map((reminder: any) => ({
          ...reminder,
          date: ensureValidDate(reminder.date)
        })));
      } catch (error) {
        console.error("Error parsing reminders:", error);
        setReminders([]);
      }
    }

    if (storedProfile) {
      setProfile(JSON.parse(storedProfile));
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

  useEffect(() => {
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
  }, [profile]);

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

  // Group projects by ID for blocked dates display
  const getGroupedProjects = useCallback(() => {
    const groupedProjects: Record<string, { project: Project, dates: Date[] }> = {};
    
    Object.entries(projects).forEach(([dateStr, project]) => {
      if (project.status === 'blocked') {
        if (!groupedProjects[project.id]) {
          groupedProjects[project.id] = {
            project,
            dates: []
          };
        }
        
        try {
          const date = parseISO(dateStr);
          if (isValid(date)) {
            groupedProjects[project.id].dates.push(date);
          }
        } catch (error) {
          console.error(`Invalid date format: ${dateStr}`, error);
        }
      }
    });
    
    return Object.values(groupedProjects);
  }, [projects]);

  // User profile functions
  const setUserProfile = (newProfile: UserProfile) => {
    setProfile(newProfile);
  };

  const getUserProfile = () => {
    return profile;
  };

  // Add or update a project with multiple dates support
  const addProject = (date: Date, projectData: {
    name: string;
    notes?: string;
    color: string;
    paymentReminder?: {
      timeValue: number;
      timeUnit: 'days' | 'weeks' | 'months';
      notes?: string;
      dueDate?: Date;
      dueTime?: string;
    };
  }) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const projectId = uuidv4();
    
    const newProject: Project = {
      id: projectId,
      name: projectData.name,
      notes: projectData.notes,
      status: 'blocked',
      color: projectData.color
    };

    setProjects(prev => ({
      ...prev,
      [dateStr]: newProject
    }));

    // Add payment reminder if specified
    if (projectData.paymentReminder?.dueDate) {
      const { dueDate, dueTime, notes } = projectData.paymentReminder;
      
      // Parse the time and set it on the due date
      let reminderDate = new Date(dueDate);
      
      if (dueTime) {
        try {
          const [timeString, period] = dueTime.split(" ");
          const [hoursStr, minutesStr] = timeString.split(":");
          
          let hours = parseInt(hoursStr, 10);
          const minutes = parseInt(minutesStr, 10);
          
          // Convert to 24-hour format
          if (period === "PM" && hours < 12) {
            hours += 12;
          } else if (period === "AM" && hours === 12) {
            hours = 0;
          }
          
          reminderDate.setHours(hours, minutes, 0, 0);
        } catch (error) {
          console.error("Error parsing time:", error);
          // Default to noon if there's an error
          reminderDate.setHours(12, 0, 0, 0);
        }
      }

      const newPayment: PaymentReminder = {
        id: uuidv4(),
        projectId,
        projectName: projectData.name,
        dueDate: reminderDate,
        notes,
        status: 'pending'
      };

      setPayments(prev => [...prev, newPayment]);
      
      toast.success(`Payment reminder set for ${format(reminderDate, 'MMM d')} at ${dueTime || '12:00 PM'}`);
    }

    return projectId;
  };

  // Add or update multiple dates at once for a project
  const addProjectToDates = (dates: Date[], projectData: {
    name: string;
    notes?: string;
    color: string;
    paymentReminder?: {
      timeValue: number;
      timeUnit: 'days' | 'weeks' | 'months';
      notes?: string;
      dueDate?: Date;
      dueTime?: string;
    };
  }) => {
    if (!dates.length) return null;
    
    const projectId = uuidv4();
    const updatedProjects = { ...projects };
    
    const newProject: Project = {
      id: projectId,
      name: projectData.name,
      notes: projectData.notes,
      status: 'blocked',
      color: projectData.color
    };
    
    // Add the project to all selected dates
    dates.forEach(date => {
      const dateStr = format(date, 'yyyy-MM-dd');
      updatedProjects[dateStr] = { ...newProject };
    });
    
    setProjects(updatedProjects);
    
    // Add payment reminder if specified (only once)
    if (projectData.paymentReminder?.dueDate) {
      const { dueDate, dueTime, notes } = projectData.paymentReminder;
      
      // Parse the time and set it on the due date
      let reminderDate = new Date(dueDate);
      
      if (dueTime) {
        try {
          const [timeString, period] = dueTime.split(" ");
          const [hoursStr, minutesStr] = timeString.split(":");
          
          let hours = parseInt(hoursStr, 10);
          const minutes = parseInt(minutesStr, 10);
          
          // Convert to 24-hour format
          if (period === "PM" && hours < 12) {
            hours += 12;
          } else if (period === "AM" && hours === 12) {
            hours = 0;
          }
          
          reminderDate.setHours(hours, minutes, 0, 0);
        } catch (error) {
          console.error("Error parsing time:", error);
          // Default to noon if there's an error
          reminderDate.setHours(12, 0, 0, 0);
        }
      }

      const newPayment: PaymentReminder = {
        id: uuidv4(),
        projectId,
        projectName: projectData.name,
        dueDate: reminderDate,
        notes,
        status: 'pending'
      };

      setPayments(prev => [...prev, newPayment]);
      
      toast.success(`Payment reminder set for ${format(reminderDate, 'MMM d')} at ${dueTime || '12:00 PM'}`);
    }
    
    return projectId;
  };

  // Edit an existing project
  const editProject = (date: Date, projectId: string, projectData: {
    name: string;
    notes?: string;
    color?: string;
  }) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const currentProject = projects[dateStr];

    if (!currentProject) return;

    const updatedProject = {
      ...currentProject,
      name: projectData.name,
      notes: projectData.notes,
      color: projectData.color || currentProject.color
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
    
    toast.info(`Date canceled for ${currentProject.name}`);
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
    
    toast.success(`${currentProject.name} is back on the schedule`);
  };

  // Mark a payment as received
  const markPaymentReceived = (paymentId: string) => {
    const payment = payments.find(p => p.id === paymentId);
    
    setPayments(prev => 
      prev.filter(payment => payment.id !== paymentId)
    );
    
    if (payment) {
      toast.success(`Payment for ${payment.projectName} marked as received`);
    }
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
        
        toast.success(`Date set as a shoot day for ${currentProject.name}`);
      }
    } else {
      toast.info(`Date remains free on your schedule`);
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
    addProjectToDates,
    editProject,
    cancelProject,
    reblockProject,
    markPaymentReceived,
    confirmShootStatus,
    setUserProfile,
    getUserProfile,
    getGroupedProjects
  };
};
