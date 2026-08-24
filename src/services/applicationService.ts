import {
  JobApplication,
  TimelineEvent,
  ApplicationStatus,
  ApplicationFilters,
} from '../types';
import { storage } from './storage';

const APPS_KEY = 'applications_db';
const TIMELINE_KEY = 'timeline_db';

const STATUS_PRIORITY: Record<ApplicationStatus, number> = {
  Offer: 1,
  Hired: 2,
  'Final Interview': 3,
  Interview: 4,
  Assessment: 5,
  Screening: 6,
  Applied: 7,
  Saved: 8,
  Withdrawn: 9,
  Rejected: 10,
};

export class ApplicationService {
  private getApplicationsRaw(): JobApplication[] {
    return storage.getItem<JobApplication[]>(APPS_KEY) || [];
  }

  private saveApplicationsRaw(apps: JobApplication[]): void {
    storage.setItem(APPS_KEY, apps);
  }

  private getTimelineRaw(): TimelineEvent[] {
    return storage.getItem<TimelineEvent[]>(TIMELINE_KEY) || [];
  }

  private saveTimelineRaw(timeline: TimelineEvent[]): void {
    storage.setItem(TIMELINE_KEY, timeline);
  }

  public getUserApplications(userId: string): JobApplication[] {
    if (!userId) return [];
    const all = this.getApplicationsRaw();
    return all.filter((app) => app.userId === userId);
  }

  public getApplicationById(id: string, userId: string): JobApplication | null {
    const apps = this.getUserApplications(userId);
    return apps.find((app) => app.id === id) || null;
  }

  public getTimelineForApplication(applicationId: string, userId: string): TimelineEvent[] {
    const all = this.getTimelineRaw();
    return all
      .filter((t) => t.applicationId === applicationId && t.userId === userId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  public getAllUserTimeline(userId: string): TimelineEvent[] {
    const all = this.getTimelineRaw();
    return all
      .filter((t) => t.userId === userId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  public createApplication(
    userId: string,
    data: Omit<JobApplication, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
  ): JobApplication {
    const allApps = this.getApplicationsRaw();
    const now = new Date().toISOString();

    const newApp: JobApplication = {
      ...data,
      id: `app-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId,
      createdAt: now,
      updatedAt: now,
    };

    allApps.unshift(newApp);
    this.saveApplicationsRaw(allApps);

    // Automatically record a creation event in the timeline
    this.addTimelineEvent({
      applicationId: newApp.id,
      userId,
      title: 'Application Logged',
      description: `Applied for ${newApp.position} at ${newApp.companyName}. Current Status: ${newApp.status}.`,
      newStatus: newApp.status,
      date: now,
      type: 'created',
    });

    if (newApp.interviewDate) {
      this.addTimelineEvent({
        applicationId: newApp.id,
        userId,
        title: 'Interview Scheduled',
        description: `Interview booked for ${new Date(newApp.interviewDate).toLocaleString()}.`,
        date: now,
        type: 'interview_scheduled',
      });
    }

    if (newApp.assessmentDate) {
      this.addTimelineEvent({
        applicationId: newApp.id,
        userId,
        title: 'Assessment Scheduled',
        description: `Assessment test booked for ${new Date(newApp.assessmentDate).toLocaleString()}.`,
        date: now,
        type: 'assessment_scheduled',
      });
    }

    return newApp;
  }

  public updateApplication(
    id: string,
    userId: string,
    updates: Partial<JobApplication>
  ): JobApplication | null {
    const allApps = this.getApplicationsRaw();
    const index = allApps.findIndex((a) => a.id === id && a.userId === userId);
    if (index === -1) return null;

    const existing = allApps[index];
    const previousStatus = existing.status;
    const now = new Date().toISOString();

    const updatedApp: JobApplication = {
      ...existing,
      ...updates,
      updatedAt: now,
    };

    allApps[index] = updatedApp;
    this.saveApplicationsRaw(allApps);

    // Auto-generate timeline entry if status changed
    if (updates.status && updates.status !== previousStatus) {
      this.addTimelineEvent({
        applicationId: id,
        userId,
        title: `Status Changed: ${updates.status}`,
        description: `Status updated from ${previousStatus} → ${updates.status}.`,
        previousStatus,
        newStatus: updates.status,
        date: now,
        type: 'status_change',
      });
    }

    // Auto-generate timeline if interview date was scheduled or updated
    if (updates.interviewDate && updates.interviewDate !== existing.interviewDate) {
      this.addTimelineEvent({
        applicationId: id,
        userId,
        title: 'Interview Scheduled',
        description: `Interview updated to ${new Date(updates.interviewDate).toLocaleString()}.`,
        date: now,
        type: 'interview_scheduled',
      });
    }

    // Auto-generate timeline if assessment date was scheduled
    if (updates.assessmentDate && updates.assessmentDate !== existing.assessmentDate) {
      this.addTimelineEvent({
        applicationId: id,
        userId,
        title: 'Assessment Scheduled',
        description: `Assessment deadline updated to ${new Date(updates.assessmentDate).toLocaleString()}.`,
        date: now,
        type: 'assessment_scheduled',
      });
    }

    // Auto-generate timeline if follow-up date was changed
    if (updates.followUpDate && updates.followUpDate !== existing.followUpDate) {
      this.addTimelineEvent({
        applicationId: id,
        userId,
        title: 'Follow-up Set',
        description: `Target follow-up scheduled for ${new Date(updates.followUpDate).toLocaleDateString()}.`,
        date: now,
        type: 'followup_scheduled',
      });
    }

    return updatedApp;
  }

  public updateStatus(
    id: string,
    userId: string,
    newStatus: ApplicationStatus,
    note?: string
  ): JobApplication | null {
    const app = this.getApplicationById(id, userId);
    if (!app) return null;

    if (note && note.trim()) {
      this.addTimelineEvent({
        applicationId: id,
        userId,
        title: `Note on ${newStatus} Status`,
        description: note.trim(),
        newStatus,
        date: new Date().toISOString(),
        type: 'note_added',
      });
    }

    return this.updateApplication(id, userId, {
      status: newStatus,
    });
  }

  public addCustomNoteToTimeline(
    applicationId: string,
    userId: string,
    title: string,
    description: string
  ): TimelineEvent {
    return this.addTimelineEvent({
      applicationId,
      userId,
      title: title || 'Application Note',
      description,
      date: new Date().toISOString(),
      type: 'note_added',
    });
  }

  public deleteApplication(id: string, userId: string): boolean {
    const allApps = this.getApplicationsRaw();
    const filtered = allApps.filter((a) => !(a.id === id && a.userId === userId));
    if (filtered.length === allApps.length) return false;

    this.saveApplicationsRaw(filtered);

    // Remove timeline events for this application
    const allTimeline = this.getTimelineRaw();
    const filteredTimeline = allTimeline.filter(
      (t) => !(t.applicationId === id && t.userId === userId)
    );
    this.saveTimelineRaw(filteredTimeline);

    return true;
  }

  public addTimelineEvent(event: Omit<TimelineEvent, 'id'>): TimelineEvent {
    const allTimeline = this.getTimelineRaw();
    const newEvent: TimelineEvent = {
      ...event,
      id: `tl-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    };
    allTimeline.unshift(newEvent);
    this.saveTimelineRaw(allTimeline);
    return newEvent;
  }

  public filterAndSort(
    apps: JobApplication[],
    filters: ApplicationFilters
  ): JobApplication[] {
    let result = [...apps];

    // Deep multi-field Search (Company, Position, Location, Recruiter, Notes)
    if (filters.search.trim()) {
      const q = filters.search.toLowerCase().trim();
      result = result.filter(
        (a) =>
          a.companyName.toLowerCase().includes(q) ||
          a.position.toLowerCase().includes(q) ||
          (a.location && a.location.toLowerCase().includes(q)) ||
          (a.recruiterName && a.recruiterName.toLowerCase().includes(q)) ||
          (a.recruiterEmail && a.recruiterEmail.toLowerCase().includes(q)) ||
          (a.notes && a.notes.toLowerCase().includes(q))
      );
    }

    // Status filter
    if (filters.status !== 'All') {
      result = result.filter((a) => a.status === filters.status);
    }

    // Work setup filter
    if (filters.workSetup !== 'All') {
      result = result.filter((a) => a.workSetup === filters.workSetup);
    }

    // Employment type filter
    if (filters.employmentType !== 'All') {
      result = result.filter((a) => a.employmentType === filters.employmentType);
    }

    // Source filter
    if (filters.applicationSource !== 'All') {
      result = result.filter((a) => a.applicationSource === filters.applicationSource);
    }

    // Sorting
    result.sort((a, b) => {
      let comparison = 0;
      switch (filters.sortBy) {
        case 'companyName':
          comparison = a.companyName.localeCompare(b.companyName);
          break;
        case 'position':
          comparison = a.position.localeCompare(b.position);
          break;
        case 'dateApplied':
          comparison = new Date(a.dateApplied || 0).getTime() - new Date(b.dateApplied || 0).getTime();
          break;
        case 'updatedAt':
          comparison = new Date(a.updatedAt || 0).getTime() - new Date(b.updatedAt || 0).getTime();
          break;
        case 'followUpDate': {
          const dateA = a.followUpDate ? new Date(a.followUpDate).getTime() : 9999999999999;
          const dateB = b.followUpDate ? new Date(b.followUpDate).getTime() : 9999999999999;
          comparison = dateA - dateB;
          break;
        }
        case 'interviewDate': {
          const dateA = a.interviewDate ? new Date(a.interviewDate).getTime() : 9999999999999;
          const dateB = b.interviewDate ? new Date(b.interviewDate).getTime() : 9999999999999;
          comparison = dateA - dateB;
          break;
        }
        case 'status': {
          const rankA = STATUS_PRIORITY[a.status] || 99;
          const rankB = STATUS_PRIORITY[b.status] || 99;
          comparison = rankA - rankB;
          break;
        }
        default:
          comparison = new Date(a.dateApplied || 0).getTime() - new Date(b.dateApplied || 0).getTime();
      }

      return filters.sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }
}

export const applicationService = new ApplicationService();
