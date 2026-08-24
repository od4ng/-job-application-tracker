import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  JobApplication,
  TimelineEvent,
  ApplicationStatus,
  ApplicationFilters,
  ReminderItem,
  DynamicInsight,
} from '../types';
import { applicationService } from '../services/applicationService';
import { analyticsService, AnalyticsSummary } from '../services/analyticsService';
import { reminderService } from '../services/reminderService';
import { useAuth } from './AuthContext';
import { useNotifications } from './NotificationContext';

export type ViewMode = 'board' | 'table' | 'cards';

interface ApplicationContextType {
  applications: JobApplication[];
  filteredApplications: JobApplication[];
  filters: ApplicationFilters;
  setFilters: React.Dispatch<React.SetStateAction<ApplicationFilters>>;
  resetFilters: () => void;
  activeAppId: string | null;
  selectedApplication: JobApplication | null;
  selectedAppTimeline: TimelineEvent[];
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  analytics: AnalyticsSummary;
  reminders: {
    all: ReminderItem[];
    overdue: ReminderItem[];
    today: ReminderItem[];
    upcoming: ReminderItem[];
  };
  insights: DynamicInsight[];
  openDrawer: (id: string) => void;
  closeDrawer: () => void;
  isAddModalOpen: boolean;
  openAddModal: () => void;
  closeAddModal: () => void;
  editingApplication: JobApplication | null;
  openEditModal: (app: JobApplication) => void;
  closeEditModal: () => void;
  createApplication: (data: Omit<JobApplication, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => JobApplication | null;
  updateApplication: (id: string, updates: Partial<JobApplication>) => JobApplication | null;
  updateStatus: (id: string, status: ApplicationStatus, note?: string) => void;
  addTimelineNote: (applicationId: string, title: string, description: string) => void;
  deleteApplication: (id: string) => boolean;
  refreshApplications: () => void;
}

const defaultFilters: ApplicationFilters = {
  search: '',
  status: 'All',
  workSetup: 'All',
  employmentType: 'All',
  applicationSource: 'All',
  sortBy: 'dateApplied',
  sortOrder: 'desc',
};

const ApplicationContext = createContext<ApplicationContextType | undefined>(undefined);

export const ApplicationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { showToast } = useNotifications();

  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [filters, setFilters] = useState<ApplicationFilters>(defaultFilters);
  const [activeAppId, setActiveAppId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [editingApplication, setEditingApplication] = useState<JobApplication | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('board');

  const refreshApplications = useCallback(() => {
    if (!user) {
      setApplications([]);
      setActiveAppId(null);
      return;
    }
    const apps = applicationService.getUserApplications(user.id);
    setApplications(apps);
  }, [user]);

  useEffect(() => {
    refreshApplications();
  }, [refreshApplications]);

  const filteredApplications = useMemo(() => {
    return applicationService.filterAndSort(applications, filters);
  }, [applications, filters]);

  const analytics: AnalyticsSummary = useMemo(() => {
    return analyticsService.calculateAnalytics(applications);
  }, [applications]);

  const reminders = useMemo(() => {
    return reminderService.generateReminders(applications);
  }, [applications]);

  const insights = useMemo(() => {
    return analytics.insights;
  }, [analytics]);

  const selectedApplication = useMemo(() => {
    if (!activeAppId || !user) return null;
    return applications.find((a) => a.id === activeAppId) || null;
  }, [activeAppId, applications, user]);

  const selectedAppTimeline = useMemo(() => {
    if (!activeAppId || !user) return [];
    return applicationService.getTimelineForApplication(activeAppId, user.id);
  }, [activeAppId, user, applications]);

  const resetFilters = () => {
    setFilters(defaultFilters);
  };

  const openDrawer = (id: string) => {
    setActiveAppId(id);
  };

  const closeDrawer = () => {
    setActiveAppId(null);
  };

  const openAddModal = () => {
    setEditingApplication(null);
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
  };

  const openEditModal = (app: JobApplication) => {
    setEditingApplication(app);
  };

  const closeEditModal = () => {
    setEditingApplication(null);
  };

  const createApplication = (
    data: Omit<JobApplication, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
  ): JobApplication | null => {
    if (!user) return null;
    const created = applicationService.createApplication(user.id, data);
    refreshApplications();
    showToast('Application Added', `Successfully added ${created.position} at ${created.companyName}.`, 'success');
    return created;
  };

  const updateApplication = (id: string, updates: Partial<JobApplication>): JobApplication | null => {
    if (!user) return null;
    const updated = applicationService.updateApplication(id, user.id, updates);
    if (updated) {
      refreshApplications();
      showToast('Application Updated', `Saved changes for ${updated.companyName}.`, 'info');
    }
    return updated;
  };

  const updateStatus = (id: string, status: ApplicationStatus, note?: string) => {
    if (!user) return;
    const updated = applicationService.updateStatus(id, user.id, status, note);
    if (updated) {
      refreshApplications();
      showToast('Status Updated', `${updated.companyName} marked as ${status}.`, 'success');
    }
  };

  const addTimelineNote = (applicationId: string, title: string, description: string) => {
    if (!user) return;
    applicationService.addCustomNoteToTimeline(applicationId, user.id, title, description);
    refreshApplications();
    showToast('Note Added', 'Added note to application timeline.', 'success');
  };

  const deleteApplication = (id: string): boolean => {
    if (!user) return false;
    const deleted = applicationService.deleteApplication(id, user.id);
    if (deleted) {
      if (activeAppId === id) setActiveAppId(null);
      refreshApplications();
      showToast('Application Removed', 'Application deleted from your tracker.', 'warning');
    }
    return deleted;
  };

  return (
    <ApplicationContext.Provider
      value={{
        applications,
        filteredApplications,
        filters,
        setFilters,
        resetFilters,
        activeAppId,
        selectedApplication,
        selectedAppTimeline,
        viewMode,
        setViewMode,
        analytics,
        reminders,
        insights,
        openDrawer,
        closeDrawer,
        isAddModalOpen,
        openAddModal,
        closeAddModal,
        editingApplication,
        openEditModal,
        closeEditModal,
        createApplication,
        updateApplication,
        updateStatus,
        addTimelineNote,
        deleteApplication,
        refreshApplications,
      }}
    >
      {children}
    </ApplicationContext.Provider>
  );
};

export const useApplications = (): ApplicationContextType => {
  const context = useContext(ApplicationContext);
  if (!context) {
    throw new Error('useApplications must be used within an ApplicationProvider');
  }
  return context;
};
