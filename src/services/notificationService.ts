
/**
 * Notification Service to handle local notifications
 */

// Request notification permission if needed
export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
};

// Schedule a notification
export const scheduleNotification = (
  title: string, 
  body: string, 
  scheduledTime: Date
): number => {
  const now = new Date();
  const timeUntilNotification = scheduledTime.getTime() - now.getTime();
  
  if (timeUntilNotification <= 0) {
    return -1;
  }
  
  const timerId = window.setTimeout(() => {
    showNotification(title, body);
  }, timeUntilNotification);
  
  // Store the scheduled notification in localStorage for persistence
  const scheduledNotifications = getScheduledNotifications();
  scheduledNotifications.push({
    id: timerId,
    title,
    body,
    time: scheduledTime.toISOString(),
  });
  
  localStorage.setItem('haan-scheduled-notifications', JSON.stringify(scheduledNotifications));
  
  return timerId;
};

// Show a notification immediately
export const showNotification = (title: string, body: string): void => {
  if (!('Notification' in window)) {
    alert(`${title}: ${body}`);
    return;
  }

  if (Notification.permission === 'granted') {
    const notification = new Notification(title, {
      body,
      icon: '/favicon.ico',
    });
    
    // Play a sound
    playNotificationSound();
    
    // Close the notification after 5 seconds
    setTimeout(() => notification.close(), 5000);
  } else {
    // Fallback for when notifications are not permitted
    console.log(`Notification: ${title} - ${body}`);
  }
};

// Cancel a scheduled notification
export const cancelNotification = (id: number): void => {
  clearTimeout(id);
  
  // Remove from storage
  const scheduledNotifications = getScheduledNotifications().filter(
    notification => notification.id !== id
  );
  
  localStorage.setItem('haan-scheduled-notifications', JSON.stringify(scheduledNotifications));
};

// Get all scheduled notifications
export const getScheduledNotifications = (): Array<{
  id: number;
  title: string;
  body: string;
  time: string;
}> => {
  const stored = localStorage.getItem('haan-scheduled-notifications');
  return stored ? JSON.parse(stored) : [];
};

// Restore scheduled notifications after page reload
export const restoreScheduledNotifications = (): void => {
  const scheduledNotifications = getScheduledNotifications();
  const now = new Date();
  
  scheduledNotifications.forEach(notification => {
    const notificationTime = new Date(notification.time);
    
    if (notificationTime > now) {
      const timeUntilNotification = notificationTime.getTime() - now.getTime();
      window.setTimeout(() => {
        showNotification(notification.title, notification.body);
      }, timeUntilNotification);
    }
  });
};

// Play a notification sound
const playNotificationSound = (): void => {
  try {
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAAABMYXZjNTguMTMuMTAwAGQhdpAAM3L//vrb5pjU2+X0//7+/v/b5OsAm6yRpdrCxN/+9vn4/v7t3L2ytM/z9/X5/v7//v327uHZ3/f//v3nq4h5gJWsuMXQ2+Pr7vL29/r8/f7//v79/Pv6+fj39vX08/Lx8O7t7Ovq6ejn5uXk4+Lh4N/e3dzb2tnY19bV1NPT0tHQz87NzMvKycjHxsXEw8LBwL++vby7urm4t7a1tLOysbCvrq2sq6qpqKempaSjoqGgn56dnJuamZiXlpWUk5KRkJaYlZGUkZWZkpaamJqblJeUl5ibmZycnJ2dnp+goKGio6SlpqeoqaqrrK2ur7CxsrO0tba3uLm6u7y9vr/AwcLDxMXGx8jJysvMzc7P0NHS09TV1tfY2drb3N3e3+Dh4uPk5ebn6Onq6+zt7u/w8fLz9PX29/j5+vv8/f7/AAECAwQFBgcICQoLDA0ODxAREhMUFRYXGBkaGxwdHh8gISIjJCUmJygpKissLS4vMDEyMzQ1Njc4OTo7PD0+P0BBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWltcXV5fYGFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6e3x9fn+AgYKDhIWGh4iJiouMjY6PkJGSk5SVlpeYmZqbnJ2en6ChoqOkpaanqKmqq6ytrq+wsbKztLW2t7i5uru8vb6/wMHCw8TFxsfIycrLzM3Oz9DR0tPU1dbX2Nna29zd3t/g4eLj5OXm5+jp6uvs7e7v8PHy8/T19vf4+fr7/P3+/wABAgMEBQYHCAkKCwwNDg8QERITFBUWFxgZGhscHR4fICEiIyQlJicoKSorLC0uLzAxMjM0NTY3ODk6Ozw9Pj9AQUJDREVGPjw9QERISEVIR0ZGRUdEQ0NCQD48Ozo5ODc1MzEwLy4sKyopJyYlJCMhIB8eHBsaGRgWFRQTEhEPDg0MCgkIBgUEAwEA/v38+/r5+Pf29fTz8vHw7+7t7Ovq6ejn5uXk4+Lh4N/e3dzb2tnY19bV1NPT0tHQz87NzMvKycjHxsXEw8LBwL++vby7urm4t7a1tLOysbCvrq2sq6qpqKempaSjoqKhoaCfnp2cm5qZmZiXlpWUk5KRkJCPjo2Mi4qJiIeGhYSDgoGAf359fHt6eXh3dnV0c3JxcG9ubWxramloZ2ZlZGNiYWBfXl1cW1pZWFdWVVRTUlFQT05NS0pJSEdGRURDQkFAPz49PDs6OTg3NjU0MzIxMC8uLSwrKikoJyYlJCMiISAfHh0cGxoZGBcWFRQTEhEQDw4NDAsKCQgHBgUEAwIBAAAJAFVFUlNJT04BAAAAQAQBARMAAQADAAsAFwAxAEkAbACSAMcAFAFwAdwBXgLdAjQDggPIA8AD3AG7AXgBEQGEAOv/O/92/rb9+PxL/Ob7mfub/q8BqQShCPcNCRRJHBIkFCkjK6cptCfkJf0k8ySvJZUmByc9Jp8jiB+sGq8V5BCVDEgJ8wbiBBYEtQOMBKgG2Qj8CW4J+gbwAkL9vvc18vbsIujI5GvjYePu5MznzOpJ7m7yOPd0/EsCLwiiDVUSJBaaGJ8ZjBkpGOUVjRJ3DqIJKgTF/mv5QfTr74zsxepj6nHrtu0e8Wr19fre//8ExAhWC5wMYgwxCwUJCwcwBZMD9wLOA0EG9glOD');
    audio.play();
  } catch (error) {
    console.error('Failed to play notification sound:', error);
  }
};
