
export type ProjectStatus = 'blocked' | 'canceled' | 'free';

export interface Project {
  id: string;
  name: string;
  notes?: string;
  status: ProjectStatus;
  color?: string; // Add color property for projects
}

export interface CalendarDay {
  date: Date;
  project?: Project;
}

export interface PaymentReminder {
  id: string;
  projectId: string;
  projectName: string;
  dueDate: Date;
  amount?: number;
  notes?: string;
  status: 'pending' | 'received';
}

export interface ShootStatusReminder {
  id: string;
  projectId: string;
  date: Date;
  responded: boolean;
}

export interface UserProfile {
  name: string;
  email?: string;
  phone?: string;
  notes?: string;
}
