import { User, JobApplication, TimelineEvent, UserBackupData, ImportPreviewResult } from '../types';
import { applicationService } from './applicationService';
import { userService } from './userService';
import { storage } from './storage';

export class BackupService {
  public exportUserJson(user: User): string {
    const applications = applicationService.getUserApplications(user.id);
    const timelineEvents = applicationService.getAllUserTimeline(user.id);

    const backup: UserBackupData = {
      version: '1.2.0',
      exportedAt: new Date().toISOString(),
      user,
      applications,
      timelineEvents,
    };

    return JSON.stringify(backup, null, 2);
  }

  public exportApplicationsCsv(userId: string): string {
    const applications = applicationService.getUserApplications(userId);

    const headers = [
      'Company Name',
      'Position',
      'Status',
      'Date Applied',
      'Work Setup',
      'Employment Type',
      'Location',
      'Salary',
      'Application Source',
      'Company Website',
      'Job URL',
      'Recruiter Name',
      'Recruiter Email',
      'Recruiter Contact',
      'Interview Date',
      'Assessment Date',
      'Follow-up Date',
      'Notes',
    ];

    const escapeCsvField = (val?: string) => {
      if (!val) return '""';
      const clean = val.replace(/"/g, '""');
      return `"${clean}"`;
    };

    const rows = applications.map((app) => [
      escapeCsvField(app.companyName),
      escapeCsvField(app.position),
      escapeCsvField(app.status),
      escapeCsvField(app.dateApplied),
      escapeCsvField(app.workSetup),
      escapeCsvField(app.employmentType),
      escapeCsvField(app.location),
      escapeCsvField(app.salary),
      escapeCsvField(app.applicationSource),
      escapeCsvField(app.companyWebsite),
      escapeCsvField(app.jobPostingUrl),
      escapeCsvField(app.recruiterName),
      escapeCsvField(app.recruiterEmail),
      escapeCsvField(app.recruiterContact),
      escapeCsvField(app.interviewDate),
      escapeCsvField(app.assessmentDate),
      escapeCsvField(app.followUpDate),
      escapeCsvField(app.notes),
    ]);

    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  }

  public downloadJSON(userId: string, filename = 'jobtracker-backup.json'): void {
    const user = userService.getUserById(userId);
    if (!user) return;
    const json = this.exportUserJson(user);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  public downloadCSV(userId: string, filename = 'jobtracker-applications.csv'): void {
    const csv = this.exportApplicationsCsv(userId);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  public validateJsonContent(jsonString: string): ImportPreviewResult {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed || typeof parsed !== 'object') {
        return { isValid: false, error: 'File does not contain a valid JSON object.', applicationsCount: 0, timelineCount: 0, applications: [], timelineEvents: [] };
      }

      // Check if it's our full backup structure or an array of applications
      let apps: Partial<JobApplication>[] = [];
      let timeline: Partial<TimelineEvent>[] = [];
      let version = parsed.version || '1.0.0';
      let exportedAt = parsed.exportedAt;

      if (Array.isArray(parsed)) {
        apps = parsed;
      } else if (Array.isArray(parsed.applications)) {
        apps = parsed.applications;
        timeline = Array.isArray(parsed.timelineEvents) ? parsed.timelineEvents : [];
      } else {
        return { isValid: false, error: 'JSON does not have an "applications" array or valid structure.', applicationsCount: 0, timelineCount: 0, applications: [], timelineEvents: [] };
      }

      if (apps.length === 0) {
        return { isValid: false, error: 'The file contains 0 application records.', applicationsCount: 0, timelineCount: 0, applications: [], timelineEvents: [] };
      }

      // Check basic validity of applications
      const invalidApp = apps.find((a) => !a.companyName || !a.position);
      if (invalidApp) {
        return { isValid: false, error: 'Some application entries are missing required fields (Company Name or Position).', applicationsCount: apps.length, timelineCount: timeline.length, applications: apps.slice(0, 5), timelineEvents: timeline };
      }

      return {
        isValid: true,
        version,
        exportedAt,
        applicationsCount: apps.length,
        timelineCount: timeline.length,
        applications: apps,
        timelineEvents: timeline,
      };
    } catch (e) {
      return {
        isValid: false,
        error: `Could not parse JSON file: ${(e as Error).message}`,
        applicationsCount: 0,
        timelineCount: 0,
        applications: [],
        timelineEvents: [],
      };
    }
  }

  public importValidatedData(
    previewData: ImportPreviewResult,
    userId: string,
    mode: 'merge' | 'replace'
  ): { success: boolean; count: number; error?: string } {
    try {
      if (!previewData.isValid || !previewData.applications) {
        return { success: false, count: 0, error: 'Invalid data provided for import.' };
      }

      const allApps = storage.getItem<JobApplication[]>('applications_db') || [];
      const allTimeline = storage.getItem<TimelineEvent[]>('timeline_db') || [];

      const existingOtherApps = allApps.filter((a) => a.userId !== userId);
      const existingUserApps = allApps.filter((a) => a.userId === userId);

      const existingOtherTimeline = allTimeline.filter((t) => t.userId !== userId);
      const existingUserTimeline = allTimeline.filter((t) => t.userId === userId);

      const sanitizedNewApps: JobApplication[] = previewData.applications.map((app) => ({
        id: app.id || `app-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        userId,
        companyName: app.companyName || 'Unknown Company',
        position: app.position || 'Applicant',
        status: app.status || 'Applied',
        dateApplied: app.dateApplied || new Date().toISOString().split('T')[0],
        workSetup: app.workSetup || 'Hybrid',
        employmentType: app.employmentType || 'Full-time',
        location: app.location || '',
        salary: app.salary || '',
        applicationSource: app.applicationSource || 'Other',
        companyWebsite: app.companyWebsite || '',
        jobPostingUrl: app.jobPostingUrl || '',
        recruiterName: app.recruiterName || '',
        recruiterEmail: app.recruiterEmail || '',
        recruiterContact: app.recruiterContact || '',
        interviewDate: app.interviewDate || '',
        assessmentDate: app.assessmentDate || '',
        followUpDate: app.followUpDate || '',
        notes: app.notes || '',
        createdAt: app.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));

      const sanitizedNewTimeline: TimelineEvent[] = (previewData.timelineEvents || []).map((tl) => ({
        id: tl.id || `tl-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        applicationId: tl.applicationId || '',
        userId,
        title: tl.title || 'Status Update',
        description: tl.description || '',
        previousStatus: tl.previousStatus,
        newStatus: tl.newStatus,
        date: tl.date || new Date().toISOString(),
        type: tl.type || 'status_change',
      }));

      if (mode === 'replace') {
        storage.setItem('applications_db', [...existingOtherApps, ...sanitizedNewApps]);
        storage.setItem('timeline_db', [...existingOtherTimeline, ...sanitizedNewTimeline]);
      } else {
        // Merge: avoid duplicated IDs
        const existingIds = new Set(existingUserApps.map((a) => a.id));
        const nonDuplicateApps = sanitizedNewApps.filter((a) => !existingIds.has(a.id));
        storage.setItem('applications_db', [...existingOtherApps, ...existingUserApps, ...nonDuplicateApps]);
        storage.setItem('timeline_db', [...existingOtherTimeline, ...existingUserTimeline, ...sanitizedNewTimeline]);
      }

      return { success: true, count: sanitizedNewApps.length };
    } catch (e) {
      return { success: false, count: 0, error: (e as Error).message };
    }
  }

  public parseCSVPreview(csvString: string): ImportPreviewResult {
    try {
      const lines = csvString.split('\n').filter((l) => l.trim() !== '');
      if (lines.length <= 1) {
        return { isValid: false, error: 'CSV is empty or has no data rows.', applicationsCount: 0, timelineCount: 0, applications: [], timelineEvents: [] };
      }

      const parseCSVLine = (line: string): string[] => {
        const result: string[] = [];
        let current = '';
        let insideQuote = false;
        for (let i = 0; i < line.length; i++) {
          const char = line[i];
          if (char === '"') {
            if (insideQuote && line[i + 1] === '"') {
              current += '"';
              i++;
            } else {
              insideQuote = !insideQuote;
            }
          } else if (char === ',' && !insideQuote) {
            result.push(current.trim());
            current = '';
          } else {
            current += char;
          }
        }
        result.push(current.trim());
        return result;
      };

      const apps: Partial<JobApplication>[] = [];
      for (let i = 1; i < lines.length; i++) {
        const cols = parseCSVLine(lines[i]);
        if (cols.length >= 2 && cols[0]) {
          apps.push({
            companyName: cols[0],
            position: cols[1] || 'Applicant',
            status: (cols[2] as any) || 'Applied',
            dateApplied: cols[3] || new Date().toISOString().split('T')[0],
            workSetup: (cols[4] as any) || 'Hybrid',
            employmentType: (cols[5] as any) || 'Full-time',
            location: cols[6] || '',
            salary: cols[7] || '',
            applicationSource: (cols[8] as any) || 'Other',
            companyWebsite: cols[9] || '',
            jobPostingUrl: cols[10] || '',
            recruiterName: cols[11] || '',
            recruiterEmail: cols[12] || '',
            recruiterContact: cols[13] || '',
            interviewDate: cols[14] || '',
            assessmentDate: cols[15] || '',
            followUpDate: cols[16] || '',
            notes: cols[17] || '',
          });
        }
      }

      return {
        isValid: apps.length > 0,
        applicationsCount: apps.length,
        timelineCount: 0,
        applications: apps,
        timelineEvents: [],
      };
    } catch (e) {
      return { isValid: false, error: (e as Error).message, applicationsCount: 0, timelineCount: 0, applications: [], timelineEvents: [] };
    }
  }
}

export const backupService = new BackupService();
