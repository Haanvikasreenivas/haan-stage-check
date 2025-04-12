
import React, { useState, useEffect } from 'react';
import { startOfToday, format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import Calendar from '@/components/Calendar/Calendar';
import PaymentsList from '@/components/Dashboard/PaymentsList';
import AddProjectModal from '@/components/Modals/AddProjectModal';
import ProjectCardModal from '@/components/Modals/ProjectCardModal';
import DateOptionsModal from '@/components/Modals/DateOptionsModal';
import ShootStatusModal from '@/components/Modals/ShootStatusModal';
import SearchModal from '@/components/Modals/SearchModal';
import Sidebar from '@/components/Sidebar/Sidebar';
import WelcomeAnimation from '@/components/WelcomeAnimation';
import { CalendarDay, ShootStatusReminder, UserProfile } from '@/types';
import { useCalendarData } from '@/hooks/useCalendarData';

const Index = () => {
  const { toast } = useToast();
  const [currentDate] = useState<Date>(startOfToday());
  const {
    calendarDays,
    payments,
    reminders,
    addProject,
    editProject,
    cancelProject,
    reblockProject,
    markPaymentReceived,
    confirmShootStatus,
    setUserProfile,
    getUserProfile
  } = useCalendarData(currentDate);

  // Modal states
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedCalendarDay, setSelectedCalendarDay] = useState<CalendarDay | null>(null);
  const [isAddProjectModalOpen, setIsAddProjectModalOpen] = useState(false);
  const [isProjectCardModalOpen, setIsProjectCardModalOpen] = useState(false);
  const [isDateOptionsModalOpen, setIsDateOptionsModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  
  // Welcome animation
  const [showWelcomeAnimation, setShowWelcomeAnimation] = useState(false);
  
  // Reminders
  const [currentReminder, setCurrentReminder] = useState<ShootStatusReminder | null>(null);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);

  // Get user profile
  const profile = getUserProfile();

  // Check for reminders that need to be shown
  useEffect(() => {
    const checkForReminders = () => {
      const today = new Date();
      const todayStr = format(today, 'yyyy-MM-dd');
      
      const dueReminder = reminders.find(reminder => 
        format(reminder.date, 'yyyy-MM-dd') === todayStr && !reminder.responded
      );
      
      if (dueReminder && !isReminderModalOpen) {
        setCurrentReminder(dueReminder);
        setIsReminderModalOpen(true);
      }
    };
    
    checkForReminders();
    
    // Set up check to run at 5:00 PM
    const now = new Date();
    const scheduledTime = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      17, // 5 PM
      0,
      0
    );
    
    let timeUntilCheck = scheduledTime.getTime() - now.getTime();
    if (timeUntilCheck < 0) {
      // If it's already past 5 PM, schedule for tomorrow
      timeUntilCheck += 24 * 60 * 60 * 1000;
    }
    
    const timerId = setTimeout(checkForReminders, timeUntilCheck);
    return () => clearTimeout(timerId);
  }, [reminders, isReminderModalOpen]);

  // Welcome message and animation on first load
  useEffect(() => {
    const isFirstVisit = !localStorage.getItem('haan-visited');
    
    if (isFirstVisit) {
      if (profile.name) {
        setShowWelcomeAnimation(true);
      } else {
        toast({
          title: "Haanvika, your stage is set for today!",
          description: "Tap any date to add a new project or check your schedule.",
        });
      }
      localStorage.setItem('haan-visited', 'true');
    }
  }, [toast, profile]);

  // Handle profile save
  const handleProfileSubmit = (name: string, email?: string, phone?: string, notes?: string) => {
    const updatedProfile: UserProfile = {
      name,
      email,
      phone,
      notes
    };
    
    setUserProfile(updatedProfile);
    
    toast({
      title: "Profile updated!",
      description: `Your profile has been saved, ${name.split(' ')[0]}.`,
    });
    
    // Show welcome animation if this is the first time setting the name
    if (!localStorage.getItem('haan-welcomed') && name) {
      setShowWelcomeAnimation(true);
      localStorage.setItem('haan-welcomed', 'true');
    }
  };

  // Handle date click from calendar
  const handleDateClick = (date: Date) => {
    const calendarDay = calendarDays.find(
      day => format(day.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    ) || { date };
    
    setSelectedDate(date);
    setSelectedCalendarDay(calendarDay);
    setIsDateOptionsModalOpen(true);
  };

  // Handle adding/editing a project
  const handleAddEditProject = (useProjectCard: boolean = false) => {
    setIsDateOptionsModalOpen(false);
    
    if (useProjectCard) {
      setSelectedDates(selectedDate ? [selectedDate] : []);
      setIsProjectCardModalOpen(true);
    } else {
      setIsAddProjectModalOpen(true);
    }
  };

  // Handle save project from ProjectCardModal
  const handleSaveProjectCard = (projectData: {
    name: string;
    notes?: string;
    color: string;
    selectedDates: Date[];
    paymentReminder?: {
      timeValue: number;
      timeUnit: 'days' | 'weeks' | 'months';
      notes?: string;
      dueDate?: Date;
      dueTime?: string;
    };
  }) => {
    if (projectData.selectedDates.length === 0) return;
    
    // Add project for each selected date
    projectData.selectedDates.forEach(date => {
      const existingProject = calendarDays.find(
        day => format(day.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
      )?.project;
      
      if (existingProject) {
        // Edit existing project
        editProject(date, existingProject.id, {
          name: projectData.name,
          notes: projectData.notes,
          color: projectData.color
        });
      } else {
        // Add new project
        addProject(date, {
          name: projectData.name,
          notes: projectData.notes,
          color: projectData.color,
          paymentReminder: projectData.paymentReminder && date === projectData.selectedDates[0] ? {
            timeValue: 1,
            timeUnit: 'days',
            notes: projectData.paymentReminder.notes
          } : undefined
        });
      }
    });
    
    toast({
      title: "Dates blocked!",
      description: `${projectData.name} has been added to ${projectData.selectedDates.length} dates.`,
    });
    
    setIsProjectCardModalOpen(false);
  };

  // Handle save project
  const handleSaveProject = (projectData: {
    name: string;
    notes?: string;
    color: string;
    paymentReminder?: {
      timeValue: number;
      timeUnit: 'days' | 'weeks' | 'months';
      notes?: string;
    };
  }) => {
    if (!selectedDate) return;
    
    const existingProject = selectedCalendarDay?.project;
    
    if (existingProject) {
      // Edit existing project
      editProject(selectedDate, existingProject.id, {
        name: projectData.name,
        notes: projectData.notes,
        color: projectData.color
      });
      
      toast({
        title: "Project updated!",
        description: `${projectData.name} has been updated.`
      });
    } else {
      // Add new project
      const projectId = addProject(selectedDate, projectData);
      
      if (projectData.paymentReminder) {
        toast({
          title: "Date blocked!",
          description: `${projectData.name} added with payment reminder.`
        });
      } else {
        toast({
          title: "Date blocked!",
          description: `${projectData.name} has been added.`
        });
      }
    }
    
    setIsAddProjectModalOpen(false);
  };

  // Handle cancel project
  const handleCancelProject = () => {
    if (!selectedDate || !selectedCalendarDay?.project) return;
    
    cancelProject(selectedDate);
    
    toast({
      title: "Date canceled",
      description: "You'll be reminded to confirm status at 5:00 PM."
    });
    
    setIsDateOptionsModalOpen(false);
  };

  // Handle re-block project
  const handleReblockProject = () => {
    if (!selectedDate || !selectedCalendarDay?.project) return;
    
    reblockProject(selectedDate);
    
    toast({
      title: "Date re-blocked!",
      description: `${selectedCalendarDay.project.name} is back on the schedule.`
    });
    
    setIsDateOptionsModalOpen(false);
  };

  // Handle payment received
  const handlePaymentReceived = (paymentId: string) => {
    markPaymentReceived(paymentId);
    
    toast({
      title: "Payment received!",
      description: "The payment reminder has been removed."
    });
  };

  // Handle shoot status confirmation
  const handleConfirmShoot = () => {
    if (!currentReminder) return;
    
    confirmShootStatus(currentReminder, true);
    
    toast({
      title: "Confirmed!",
      description: "Date has been set as a shoot day."
    });
    
    setIsReminderModalOpen(false);
    setCurrentReminder(null);
  };

  // Handle no shoot confirmation
  const handleConfirmNoShoot = () => {
    if (!currentReminder) return;
    
    confirmShootStatus(currentReminder, false);
    
    toast({
      title: "Noted!",
      description: "Date remains free on your schedule."
    });
    
    setIsReminderModalOpen(false);
    setCurrentReminder(null);
  };

  // Handle today button click
  const handleTodayClick = () => {
    // This will be handled in the Calendar component
    toast({
      title: "Today's schedule",
      description: "Showing today's date on the calendar."
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header 
        onSearchClick={() => setIsSearchModalOpen(true)}
        onTodayClick={handleTodayClick}
        onMenuClick={() => setIsSidebarOpen(true)}
      />
      
      <main className="flex-1 container max-w-4xl mx-auto p-4 md:p-6 space-y-6">
        {profile.name && (
          <h2 className="text-xl font-semibold text-gray-800 pb-2 slide-in">
            Hey {profile.name.split(' ')[0]}
          </h2>
        )}
        
        <Calendar onDateClick={handleDateClick} />
        
        {payments.length > 0 && (
          <PaymentsList 
            payments={payments} 
            onMarkAsReceived={handlePaymentReceived} 
          />
        )}
      </main>
      
      {/* Sidebar */}
      <Sidebar 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        calendarDays={calendarDays}
        onDateSelect={handleDateClick}
        onProfileSubmit={handleProfileSubmit}
        profile={profile}
      />
      
      {/* Welcome Animation */}
      {showWelcomeAnimation && (
        <WelcomeAnimation 
          name={profile.name} 
          onClose={() => setShowWelcomeAnimation(false)} 
        />
      )}
      
      {/* Modals */}
      <AddProjectModal
        isOpen={isAddProjectModalOpen}
        date={selectedDate}
        existingProject={selectedCalendarDay?.project}
        onClose={() => setIsAddProjectModalOpen(false)}
        onSave={handleSaveProject}
      />
      
      <ProjectCardModal
        isOpen={isProjectCardModalOpen}
        date={selectedDate}
        existingProject={selectedCalendarDay?.project}
        selectedDates={selectedDates}
        onClose={() => setIsProjectCardModalOpen(false)}
        onSave={handleSaveProjectCard}
      />
      
      <DateOptionsModal
        isOpen={isDateOptionsModalOpen}
        calendarDay={selectedCalendarDay}
        onClose={() => setIsDateOptionsModalOpen(false)}
        onEditProject={() => handleAddEditProject(true)}
        onCancelProject={handleCancelProject}
        onReblockProject={handleReblockProject}
      />
      
      <ShootStatusModal
        isOpen={isReminderModalOpen}
        reminder={currentReminder}
        onClose={() => {}}  // Prevent closing without a choice
        onConfirmShoot={handleConfirmShoot}
        onConfirmNoShoot={handleConfirmNoShoot}
      />
      
      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        calendarDays={calendarDays}
        onDateSelect={handleDateClick}
      />
    </div>
  );
};

export default Index;
