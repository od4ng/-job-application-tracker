import { ApplicationStatus, ApplicationSource, EmploymentType, WorkSetup } from '../types';

export const APPLICATION_STATUSES: ApplicationStatus[] = [
  'Saved',
  'Applied',
  'Screening',
  'Interview',
  'Assessment',
  'Final Interview',
  'Offer',
  'Hired',
  'Rejected',
  'Withdrawn',
];

export const WORK_SETUPS: WorkSetup[] = ['On-site', 'Hybrid', 'Remote'];

export const EMPLOYMENT_TYPES: EmploymentType[] = [
  'Full-time',
  'Part-time',
  'Internship',
  'Contract',
  'Freelance',
];

export const APPLICATION_SOURCES: ApplicationSource[] = [
  'LinkedIn',
  'JobStreet',
  'Indeed',
  'Facebook',
  'Company Website',
  'Referral',
  'Campus Job Fair',
  'Handshake',
  'Glassdoor',
  'Kalibrr',
  'Other',
];

export const STATUS_CONFIG: Record<
  ApplicationStatus,
  {
    label: string;
    bgLight: string;
    textLight: string;
    borderLight: string;
    bgDark: string;
    textDark: string;
    borderDark: string;
    dotColor: string;
  }
> = {
  Saved: {
    label: 'Saved',
    bgLight: 'bg-slate-100',
    textLight: 'text-slate-700',
    borderLight: 'border-slate-300',
    bgDark: 'dark:bg-slate-800/70',
    textDark: 'dark:text-slate-300',
    borderDark: 'dark:border-slate-700',
    dotColor: 'bg-slate-500',
  },
  Applied: {
    label: 'Applied',
    bgLight: 'bg-blue-50',
    textLight: 'text-blue-700',
    borderLight: 'border-blue-200',
    bgDark: 'dark:bg-blue-950/50',
    textDark: 'dark:text-blue-300',
    borderDark: 'dark:border-blue-800',
    dotColor: 'bg-blue-500',
  },
  Screening: {
    label: 'Screening',
    bgLight: 'bg-cyan-50',
    textLight: 'text-cyan-700',
    borderLight: 'border-cyan-200',
    bgDark: 'dark:bg-cyan-950/50',
    textDark: 'dark:text-cyan-300',
    borderDark: 'dark:border-cyan-800',
    dotColor: 'bg-cyan-500',
  },
  Interview: {
    label: 'Interview',
    bgLight: 'bg-indigo-50',
    textLight: 'text-indigo-700',
    borderLight: 'border-indigo-200',
    bgDark: 'dark:bg-indigo-950/50',
    textDark: 'dark:text-indigo-300',
    borderDark: 'dark:border-indigo-800',
    dotColor: 'bg-indigo-500',
  },
  Assessment: {
    label: 'Assessment',
    bgLight: 'bg-purple-50',
    textLight: 'text-purple-700',
    borderLight: 'border-purple-200',
    bgDark: 'dark:bg-purple-950/50',
    textDark: 'dark:text-purple-300',
    borderDark: 'dark:border-purple-800',
    dotColor: 'bg-purple-500',
  },
  'Final Interview': {
    label: 'Final Interview',
    bgLight: 'bg-violet-50',
    textLight: 'text-violet-700',
    borderLight: 'border-violet-200',
    bgDark: 'dark:bg-violet-950/50',
    textDark: 'dark:text-violet-300',
    borderDark: 'dark:border-violet-800',
    dotColor: 'bg-violet-500',
  },
  Offer: {
    label: 'Offer',
    bgLight: 'bg-amber-50',
    textLight: 'text-amber-800',
    borderLight: 'border-amber-200',
    bgDark: 'dark:bg-amber-950/50',
    textDark: 'dark:text-amber-300',
    borderDark: 'dark:border-amber-800',
    dotColor: 'bg-amber-500',
  },
  Hired: {
    label: 'Hired 🎉',
    bgLight: 'bg-emerald-50',
    textLight: 'text-emerald-800',
    borderLight: 'border-emerald-200',
    bgDark: 'dark:bg-emerald-950/50',
    textDark: 'dark:text-emerald-300',
    borderDark: 'dark:border-emerald-800',
    dotColor: 'bg-emerald-500',
  },
  Rejected: {
    label: 'Rejected',
    bgLight: 'bg-rose-50',
    textLight: 'text-rose-700',
    borderLight: 'border-rose-200',
    bgDark: 'dark:bg-rose-950/50',
    textDark: 'dark:text-rose-300',
    borderDark: 'dark:border-rose-800',
    dotColor: 'bg-rose-500',
  },
  Withdrawn: {
    label: 'Withdrawn',
    bgLight: 'bg-stone-100',
    textLight: 'text-stone-700',
    borderLight: 'border-stone-200',
    bgDark: 'dark:bg-stone-900/60',
    textDark: 'dark:text-stone-400',
    borderDark: 'dark:border-stone-800',
    dotColor: 'bg-stone-500',
  },
};
