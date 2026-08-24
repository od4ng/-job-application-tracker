export type ApplicationStatus =
  | 'Saved'
  | 'Applied'
  | 'Screening'
  | 'Interview'
  | 'Assessment'
  | 'Final Interview'
  | 'Offer'
  | 'Hired'
  | 'Rejected'
  | 'Withdrawn';

export type WorkSetup = 'On-site' | 'Hybrid' | 'Remote';

export type EmploymentType = 'Full-time' | 'Part-time' | 'Internship' | 'Contract' | 'Freelance';

export type ApplicationSource =
  | 'LinkedIn'
  | 'JobStreet'
  | 'Indeed'
  | 'Facebook'
  | 'Company Website'
  | 'Referral'
  | 'Campus Job Fair'
  | 'Handshake'
  | 'Glassdoor'
  | 'Kalibrr'
  | 'Other';

export interface WorkExperienceItem {
  id: string;
  role: string;
  company: string;
  location: string;
  period: string;
  details: string[];
}

export interface ProjectItem {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  techStack: string[];
  highlights: string[];
  link?: string;
}

export interface SkillCategory {
  category: string;
  skills: string[];
}

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  avatarUrl: string;
  phone?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  school: string;
  schoolLocation?: string;
  course: string;
  graduationYear: string | number;
  location: string;
  preferredRole: string;
  skills: string[];
  skillCategories?: SkillCategory[];
  experiences?: WorkExperienceItem[];
  projects?: ProjectItem[];
  bio: string;
  createdAt: string;
}

export interface JobApplication {
  id: string;
  userId: string;
  companyName: string;
  position: string;
  dateApplied: string;
  status: ApplicationStatus;
  companyWebsite?: string;
  jobPostingUrl?: string;
  location?: string;
  workSetup?: WorkSetup;
  employmentType?: EmploymentType;
  salary?: string;
  recruiterName?: string;
  recruiterEmail?: string;
  recruiterContact?: string;
  interviewDate?: string;
  assessmentDate?: string;
  followUpDate?: string;
  notes?: string;
  applicationSource?: ApplicationSource;
  createdAt: string;
  updatedAt: string;
}

export type TimelineEventType =
  | 'created'
  | 'status_change'
  | 'interview_scheduled'
  | 'assessment_scheduled'
  | 'followup_scheduled'
  | 'note_added';

export interface TimelineEvent {
  id: string;
  applicationId: string;
  userId: string;
  title: string;
  description?: string;
  previousStatus?: ApplicationStatus;
  newStatus?: ApplicationStatus;
  date: string;
  type: TimelineEventType;
}

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'interview' | 'assessment' | 'followup' | 'status' | 'general';
  read: boolean;
  relatedId?: string;
  createdAt: string;
}

export type SortByOption =
  | 'dateApplied'
  | 'updatedAt'
  | 'companyName'
  | 'position'
  | 'followUpDate'
  | 'interviewDate'
  | 'status';

export interface ApplicationFilters {
  search: string;
  status: ApplicationStatus | 'All';
  workSetup: WorkSetup | 'All';
  employmentType: EmploymentType | 'All';
  applicationSource: ApplicationSource | 'All';
  sortBy: SortByOption;
  sortOrder: 'asc' | 'desc';
}

export type ReminderUrgency = 'overdue' | 'today' | 'upcoming';
export type ReminderType = 'interview' | 'assessment' | 'followup';

export interface ReminderItem {
  id: string;
  applicationId: string;
  application: JobApplication;
  companyName: string;
  position: string;
  type: ReminderType;
  title: string;
  subtitle: string;
  date: string;
  urgency: ReminderUrgency;
  daysDiff: number;
}

export interface DynamicInsight {
  id: string;
  title: string;
  description: string;
  category: 'pace' | 'rate' | 'action' | 'source' | 'role';
  metricValue?: string;
}

export interface UserBackupData {
  version: string;
  exportedAt: string;
  user: User;
  applications: JobApplication[];
  timelineEvents: TimelineEvent[];
}

export interface ImportPreviewResult {
  isValid: boolean;
  error?: string;
  version?: string;
  exportedAt?: string;
  applicationsCount: number;
  timelineCount: number;
  applications: Partial<JobApplication>[];
  timelineEvents: Partial<TimelineEvent>[];
}
