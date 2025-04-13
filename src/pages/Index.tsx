import React, { useState, useEffect, useCallback } from 'react';
import { startOfToday, format, isSameMonth } from 'date-fns';
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
import BlockedDatesCard from '@/components/Dashboard/BlockedDatesCard';
import NotificationToast from '@/components/Notifications/NotificationToast';
import { CalendarDay, ShootStatusReminder, UserProfile, Project } from '@/types';
import { useCalendarData } from '@/hooks/useCalendarData';

const Index = () => {
  const { toast } = useToast();
  const [currentDate, setCurrentDate] = useState<Date>(startOfToday());
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

  // Blocked projects for display on homepage
  const [blockedProjects, setBlockedProjects] = useState<{ project: Project, dates: Date[] }[]>([]);
  
  // Custom notification
  const [notification, setNotification] = useState<string | null>(null);

  // Current month for filtering
  const [currentMonth, setCurrentMonth] = useState<Date>(startOfToday());

  // Get user profile
  const profile = getUserProfile();

  // Group blocked dates by project
  useEffect(() => {
    const projectsMap: { [projectId: string]: { project: Project, dates: Date[] } } = {};
    
    calendarDays.forEach((day) => {
      if (day.project && day.project.status === 'blocked') {
        // Only include dates from the currently displayed month
        if (isSameMonth(day.date, currentMonth)) {
          if (!projectsMap[day.project.id]) {
            projectsMap[day.project.id] = {
              project: day.project,
              dates: []
            };
          }
          projectsMap[day.project.id].dates.push(day.date);
        }
      }
    });
    
    setBlockedProjects(Object.values(projectsMap));
  }, [calendarDays, currentMonth]);

  // Show a custom notification that fades away
  const showNotification = useCallback((message: string) => {
    setNotification(message);
  }, []);

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
    
    showNotification(`Profile updated, ${name.split(' ')[0]}!`);
    
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
        const paymentReminderData = projectData.paymentReminder?.dueDate 
          ? {
              timeValue: 1,
              timeUnit: 'days' as const,
              notes: projectData.paymentReminder.notes,
              dueDate: projectData.paymentReminder.dueDate,
              dueTime: projectData.paymentReminder.dueTime
            }
          : undefined;
        
        addProject(date, {
          name: projectData.name,
          notes: projectData.notes,
          color: projectData.color,
          paymentReminder: date === projectData.selectedDates[0] ? paymentReminderData : undefined
        });
      }
    });
    
    showNotification(`${projectData.name} has been added to ${projectData.selectedDates.length} dates`);
    
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
      dueDate?: Date;
      dueTime?: string;
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
      
      showNotification(`${projectData.name} has been updated`);
    } else {
      // Add new project
      const projectId = addProject(selectedDate, projectData);
      
      if (projectData.paymentReminder) {
        showNotification(`${projectData.name} added with payment reminder`);
      } else {
        showNotification(`${projectData.name} has been added`);
      }
    }
    
    setIsAddProjectModalOpen(false);
  };

  // Handle cancel project
  const handleCancelProject = () => {
    if (!selectedDate || !selectedCalendarDay?.project) return;
    
    cancelProject(selectedDate);
    
    showNotification("Date canceled");
    
    setIsDateOptionsModalOpen(false);
  };

  // Handle re-block project
  const handleReblockProject = () => {
    if (!selectedDate || !selectedCalendarDay?.project) return;
    
    reblockProject(selectedDate);
    
    showNotification(`${selectedCalendarDay?.project?.name} is back on the schedule`);
    
    setIsDateOptionsModalOpen(false);
  };

  // Handle payment received
  const handlePaymentReceived = (paymentId: string) => {
    markPaymentReceived(paymentId);
    
    showNotification("Payment received!");
  };

  // Handle shoot status confirmation
  const handleConfirmShoot = () => {
    if (!currentReminder) return;
    
    confirmShootStatus(currentReminder, true);
    
    showNotification("Date has been set as a shoot day");
    
    setIsReminderModalOpen(false);
    setCurrentReminder(null);
  };

  // Handle no shoot confirmation
  const handleConfirmNoShoot = () => {
    if (!currentReminder) return;
    
    confirmShootStatus(currentReminder, false);
    
    showNotification("Date remains free on your schedule");
    
    setIsReminderModalOpen(false);
    setCurrentReminder(null);
  };

  // Handle today button click
  const handleTodayClick = () => {
    setCurrentMonth(startOfToday());
    showNotification("Showing today's date");
  };

  // Handle month change
  const handleMonthChange = (newMonth: Date) => {
    setCurrentMonth(newMonth);
  };

  // Handle blocked date card click
  const handleBlockedDateCardClick = (project: Project, dates: Date[]) => {
    if (dates.length > 0) {
      setSelectedDate(dates[0]);
      setSelectedCalendarDay({
        date: dates[0],
        project
      });
      setSelectedDates(dates);
      setIsProjectCardModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header 
        onSearchClick={() => setIsSearchModalOpen(true)}
        onTodayClick={handleTodayClick}
        onMenuClick={() => setIsSidebarOpen(true)}
      />
      
      <main className="flex-1 container max-w-4xl mx-auto p-4 md:p-6 space-y-6" onClick={() => isSidebarOpen && setIsSidebarOpen(false)}>
        <div className="text-center mb-2 animate-fade-in">
          <h2 className="text-xl font-medium">
            Hey {profile.name ? profile.name.split(' ')[0] : 'HAAN'} ❤️
          </h2>
        </div>
        
        <Calendar 
          onDateClick={handleDateClick} 
          userName={profile.name}
          onMonthChange={handleMonthChange}
        />
        
        {/* Blocked Dates Section on homepage */}
        {blockedProjects.length > 0 && (
          <div className="space-y-3 animate-fade-in">
            <h3 className="text-lg font-medium">Blocked Dates</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {blockedProjects.map(({ project, dates }) => (
                <BlockedDatesCard
                  key={project.id}
                  project={{
                    id: project.id,
                    name: project.name,
                    color: project.color || '#000000' // Provide default color if missing
                  }}
                  dates={dates}
                  onClick={() => handleBlockedDateCardClick(project, dates)}
                />
              ))}
            </div>
          </div>
        )}
        
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
        onHomeClick={() => {}}
      />
      
      {/* Welcome Animation */}
      {showWelcomeAnimation && (
        <WelcomeAnimation 
          name={profile.name} 
          onClose={() => setShowWelcomeAnimation(false)} 
        />
      )}
      
      {/* Notification Toast */}
      {notification && (
        <NotificationToast 
          message={notification}
          onClose={() => setNotification(null)}
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
