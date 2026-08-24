import { JobApplication, UserBackupData } from '../types';
import { APPLICATION_STATUSES } from './constants';

export function validateApplicationForm(data: Partial<JobApplication>): {
  isValid: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};

  if (!data.companyName || data.companyName.trim() === '') {
    errors.companyName = 'Company name is required';
  }

  if (!data.position || data.position.trim() === '') {
    errors.position = 'Position / Job Title is required';
  }

  if (!data.dateApplied || data.dateApplied.trim() === '') {
    errors.dateApplied = 'Date applied is required';
  }

  if (!data.status) {
    errors.status = 'Status is required';
  } else if (!APPLICATION_STATUSES.includes(data.status)) {
    errors.status = 'Invalid status selected';
  }

  if (data.companyWebsite && data.companyWebsite.trim() !== '') {
    if (!/^https?:\/\//i.test(data.companyWebsite) && !data.companyWebsite.startsWith('www.')) {
      errors.companyWebsite = 'Please enter a valid URL (e.g., https://example.com)';
    }
  }

  if (data.jobPostingUrl && data.jobPostingUrl.trim() !== '') {
    if (!/^https?:\/\//i.test(data.jobPostingUrl) && !data.jobPostingUrl.startsWith('www.')) {
      errors.jobPostingUrl = 'Please enter a valid URL';
    }
  }

  if (data.recruiterEmail && data.recruiterEmail.trim() !== '') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.recruiterEmail)) {
      errors.recruiterEmail = 'Please enter a valid email address';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateBackupJson(jsonData: unknown): {
  isValid: boolean;
  error?: string;
  data?: UserBackupData;
} {
  if (!jsonData || typeof jsonData !== 'object') {
    return { isValid: false, error: 'File does not contain valid JSON object.' };
  }

  const obj = jsonData as Record<string, unknown>;

  if (!obj.version) {
    return { isValid: false, error: 'Missing backup version header.' };
  }

  if (!Array.isArray(obj.applications)) {
    return { isValid: false, error: 'Backup is missing applications collection.' };
  }

  // Validate at least the structure of each application
  for (let i = 0; i < obj.applications.length; i++) {
    const app = obj.applications[i];
    if (!app.companyName || !app.position || !app.status) {
      return {
        isValid: false,
        error: `Application at index ${i} is missing mandatory fields (companyName, position, or status).`,
      };
    }
  }

  return {
    isValid: true,
    data: obj as unknown as UserBackupData,
  };
}
