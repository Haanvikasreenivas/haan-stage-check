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
import ReminderModal from '@/components/Modals/ReminderModal';
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

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedCalendarDay, setSelectedCalendarDay] = useState<CalendarDay | null>(null);
  const [isAddProjectModalOpen, setIsAddProjectModalOpen] = useState(false);
  const [isProjectCardModalOpen, setIsProjectCardModalOpen] = useState(false);
  const [isDateOptionsModalOpen, setIsDateOptionsModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  
  const [showWelcomeAnimation, setShowWelcomeAnimation] = useState(false);
  
  const [currentReminder, setCurrentReminder] = useState<ShootStatusReminder | null>(null);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);

  const [blockedProjects, setBlockedProjects] = useState<{ project: Project, dates: Date[] }[]>([]);
  
  const [notification, setNotification] = useState<string | null>(null);

  const [currentMonth, setCurrentMonth] = useState<Date>(startOfToday());
  const [isSetReminderModalOpen, setIsSetReminderModalOpen] = useState(false);

  const profile = getUserProfile();

  useEffect(() => {
    const projectsMap: { [projectId: string]: { project: Project, dates: Date[] } } = {};
    
    calendarDays.forEach((day) => {
      if (day.project && day.project.status === 'blocked') {
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

  const showNotification = useCallback((message: string) => {
    setNotification(message);
  }, []);

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
    
    const now = new Date();
    const scheduledTime = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      17,
      0,
      0
    );
    
    let timeUntilCheck = scheduledTime.getTime() - now.getTime();
    if (timeUntilCheck < 0) {
      timeUntilCheck += 24 * 60 * 60 * 1000;
    }
    
    const timerId = setTimeout(checkForReminders, timeUntilCheck);
    return () => clearTimeout(timerId);
  }, [reminders, isReminderModalOpen]);

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

  const handleProfileSubmit = (name: string, email?: string, phone?: string, notes?: string) => {
    const updatedProfile: UserProfile = {
      name,
      email,
      phone,
      notes
    };
    
    setUserProfile(updatedProfile);
    
    showNotification(`Profile updated, ${name.split(' ')[0]}!`);
    setIsSidebarOpen(false);
    
    if (!localStorage.getItem('haan-welcomed') && name) {
      setShowWelcomeAnimation(true);
      localStorage.setItem('haan-welcomed', 'true');
    }
  };

  const handleDateClick = (date: Date) => {
    const calendarDay = calendarDays.find(
      day => format(day.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    ) || { date };
    
    setSelectedDate(date);
    setSelectedCalendarDay(calendarDay);
    setIsDateOptionsModalOpen(true);
  };

  const handleAddEditProject = (useProjectCard: boolean = false) => {
    setIsDateOptionsModalOpen(false);
    
    if (useProjectCard) {
      setSelectedDates(selectedDate ? [selectedDate] : []);
      setIsProjectCardModalOpen(true);
    } else {
      setIsAddProjectModalOpen(true);
    }
  };

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
    
    projectData.selectedDates.forEach(date => {
      const existingProject = calendarDays.find(
        day => format(day.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
      )?.project;
      
      if (existingProject) {
        editProject(date, existingProject.id, {
          name: projectData.name,
          notes: projectData.notes,
          color: projectData.color
        });
      } else {
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
      editProject(selectedDate, existingProject.id, {
        name: projectData.name,
        notes: projectData.notes,
        color: projectData.color
      });
      
      showNotification(`${projectData.name} has been updated`);
    } else {
      const projectId = addProject(selectedDate, projectData);
      
      if (projectData.paymentReminder) {
        showNotification(`${projectData.name} added with payment reminder`);
      } else {
        showNotification(`${projectData.name} has been added`);
      }
    }
    
    setIsAddProjectModalOpen(false);
  };

  const handleCancelProject = () => {
    if (!selectedDate || !selectedCalendarDay?.project) return;
    
    cancelProject(selectedDate);
    
    showNotification("Date canceled");
    
    setIsDateOptionsModalOpen(false);
  };

  const handleReblockProject = () => {
    if (!selectedDate || !selectedCalendarDay?.project) return;
    
    reblockProject(selectedDate);
    
    showNotification(`${selectedCalendarDay?.project?.name} is back on the schedule`);
    
    setIsDateOptionsModalOpen(false);
  };

  const handlePaymentReceived = (paymentId: string) => {
    markPaymentReceived(paymentId);
    
    showNotification("Payment received!");
  };

  const handleConfirmShoot = () => {
    if (!currentReminder) return;
    
    confirmShootStatus(currentReminder, true);
    
    showNotification("Date has been set as a shoot day");
    
    setIsReminderModalOpen(false);
    setCurrentReminder(null);
  };

  const handleConfirmNoShoot = () => {
    if (!currentReminder) return;
    
    confirmShootStatus(currentReminder, false);
    
    showNotification("Date remains free on your schedule");
    
    setIsReminderModalOpen(false);
    setCurrentReminder(null);
  };

  const handleTodayClick = () => {
    setCurrentMonth(startOfToday());
    showNotification("Showing today's date");
  };

  const handleMonthChange = (newMonth: Date) => {
    setCurrentMonth(newMonth);
  };

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

  const handleAddReminder = (reminderData: {
    title: string;
    date: Date;
    time: string;
    projectId?: string;
    notes?: string;
  }) => {
    console.log('Creating reminder:', reminderData);
    showNotification(`Reminder set for ${format(reminderData.date, 'MMM d')} at ${reminderData.time}`);
    
    setIsSetReminderModalOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header 
        onSearchClick={() => setIsSearchModalOpen(true)}
        onTodayClick={handleTodayClick}
        onMenuClick={() => setIsSidebarOpen(true)}
      />
      
      <main className="flex-1 container max-w-4xl mx-auto p-4 md:p-6 space-y-6" onClick={() => isSidebarOpen && setIsSidebarOpen(false)}>
        <Calendar 
          onDateClick={handleDateClick} 
          userName={profile.name}
          onMonthChange={handleMonthChange}
        />
        
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
                    color: project.color || '#000000'
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
      
      <Sidebar 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        calendarDays={calendarDays}
        onDateSelect={handleDateClick}
        onProfileSubmit={handleProfileSubmit}
        profile={profile}
        onHomeClick={() => {}}
      />
      
      {showWelcomeAnimation && (
        <WelcomeAnimation 
          name={profile.name} 
          onClose={() => setShowWelcomeAnimation(false)} 
        />
      )}
      
      {notification && (
        <NotificationToast 
          message={notification}
          onClose={() => setNotification(null)}
        />
      )}
      
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
        onClose={() => {}}
        onConfirmShoot={handleConfirmShoot}
        onConfirmNoShoot={handleConfirmNoShoot}
      />
      
      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        calendarDays={calendarDays}
        onDateSelect={handleDateClick}
      />
      
      <ReminderModal
        isOpen={isSetReminderModalOpen}
        onClose={() => setIsSetReminderModalOpen(false)}
        projects={calendarDays
          .filter(day => day.project)
          .map(day => day.project!)
          .filter((project, index, self) => 
            index === self.findIndex(p => p.id === project.id)
          )
        }
        onSave={handleAddReminder}
      />
    </div>
  );
};

export default Index;
