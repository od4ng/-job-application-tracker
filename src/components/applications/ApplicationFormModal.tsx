import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { JobApplication, ApplicationStatus, WorkSetup, EmploymentType, ApplicationSource } from '../../types';
import {
  APPLICATION_STATUSES,
  WORK_SETUPS,
  EMPLOYMENT_TYPES,
  APPLICATION_SOURCES,
} from '../../utils/constants';
import { validateApplicationForm } from '../../utils/validators';
import { useApplications } from '../../context/ApplicationContext';

export const ApplicationFormModal: React.FC = () => {
  const {
    isAddModalOpen,
    closeAddModal,
    editingApplication,
    closeEditModal,
    createApplication,
    updateApplication,
  } = useApplications();

  const isOpen = isAddModalOpen || !!editingApplication;
  const isEditing = !!editingApplication;

  const [formData, setFormData] = useState<Partial<JobApplication>>({
    companyName: '',
    position: '',
    dateApplied: new Date().toISOString().split('T')[0],
    status: 'Applied' as ApplicationStatus,
    companyWebsite: '',
    jobPostingUrl: '',
    location: '',
    workSetup: 'Hybrid' as WorkSetup,
    employmentType: 'Full-time' as EmploymentType,
    salary: '',
    recruiterName: '',
    recruiterEmail: '',
    recruiterContact: '',
    interviewDate: '',
    assessmentDate: '',
    followUpDate: '',
    notes: '',
    applicationSource: 'LinkedIn' as ApplicationSource,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<'general' | 'dates' | 'recruiter'>('general');

  useEffect(() => {
    if (editingApplication) {
      setFormData({
        ...editingApplication,
        interviewDate: editingApplication.interviewDate
          ? editingApplication.interviewDate.substring(0, 16)
          : '',
        assessmentDate: editingApplication.assessmentDate
          ? editingApplication.assessmentDate.substring(0, 16)
          : '',
        followUpDate: editingApplication.followUpDate
          ? editingApplication.followUpDate.split('T')[0]
          : '',
      });
      setErrors({});
    } else {
      setFormData({
        companyName: '',
        position: '',
        dateApplied: new Date().toISOString().split('T')[0],
        status: 'Applied' as ApplicationStatus,
        companyWebsite: '',
        jobPostingUrl: '',
        location: '',
        workSetup: 'Hybrid' as WorkSetup,
        employmentType: 'Full-time' as EmploymentType,
        salary: '',
        recruiterName: '',
        recruiterEmail: '',
        recruiterContact: '',
        interviewDate: '',
        assessmentDate: '',
        followUpDate: '',
        notes: '',
        applicationSource: 'LinkedIn' as ApplicationSource,
      });
      setErrors({});
    }
  }, [editingApplication, isAddModalOpen]);

  const handleClose = () => {
    if (isEditing) {
      closeEditModal();
    } else {
      closeAddModal();
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateApplicationForm(formData);

    if (!validation.isValid) {
      setErrors(validation.errors);
      // Auto-switch tab if error is in another tab
      if (validation.errors.companyName || validation.errors.position || validation.errors.dateApplied) {
        setActiveTab('general');
      }
      return;
    }

    if (isEditing && editingApplication) {
      updateApplication(editingApplication.id, formData);
    } else {
      createApplication(formData as Omit<JobApplication, 'id' | 'userId' | 'createdAt' | 'updatedAt'>);
    }

    handleClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEditing ? 'Edit Job Application' : 'Add New Job Application'}
      description={
        isEditing
          ? 'Update details, recruiter information, or schedule dates.'
          : 'Log a new application to keep track of statuses and follow-ups.'
      }
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Form Category Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 pb-2 gap-2 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('general')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              activeTab === 'general'
                ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300 font-semibold'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
            }`}
          >
            1. Job Details
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('dates')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              activeTab === 'dates'
                ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300 font-semibold'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
            }`}
          >
            2. Dates & Deadlines
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('recruiter')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              activeTab === 'recruiter'
                ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300 font-semibold'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
            }`}
          >
            3. Contacts & Links
          </button>
        </div>

        {/* Tab 1: Core Details */}
        {activeTab === 'general' && (
          <div className="space-y-4 animate-in fade-in duration-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Company Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName || ''}
                  onChange={handleChange}
                  placeholder="e.g., Acme Corp"
                  className={`w-full px-3 py-2 text-sm rounded-lg border bg-white dark:bg-slate-900 text-slate-900 dark:text-white ${
                    errors.companyName
                      ? 'border-rose-500 ring-1 ring-rose-500'
                      : 'border-slate-200 dark:border-slate-700'
                  }`}
                  required
                />
                {errors.companyName && (
                  <p className="text-[11px] text-rose-500 mt-1">{errors.companyName}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Position / Role <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="position"
                  value={formData.position || ''}
                  onChange={handleChange}
                  placeholder="e.g., Junior Frontend Developer"
                  className={`w-full px-3 py-2 text-sm rounded-lg border bg-white dark:bg-slate-900 text-slate-900 dark:text-white ${
                    errors.position
                      ? 'border-rose-500 ring-1 ring-rose-500'
                      : 'border-slate-200 dark:border-slate-700'
                  }`}
                  required
                />
                {errors.position && (
                  <p className="text-[11px] text-rose-500 mt-1">{errors.position}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Current Status <span className="text-rose-500">*</span>
                </label>
                <select
                  name="status"
                  value={formData.status || 'Applied'}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                >
                  {APPLICATION_STATUSES.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Date Applied <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  name="dateApplied"
                  value={formData.dateApplied || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Work Setup
                </label>
                <select
                  name="workSetup"
                  value={formData.workSetup || 'Hybrid'}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                >
                  {WORK_SETUPS.map((ws) => (
                    <option key={ws} value={ws}>
                      {ws}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Employment Type
                </label>
                <select
                  name="employmentType"
                  value={formData.employmentType || 'Full-time'}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                >
                  {EMPLOYMENT_TYPES.map((et) => (
                    <option key={et} value={et}>
                      {et}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Source
                </label>
                <select
                  name="applicationSource"
                  value={formData.applicationSource || 'LinkedIn'}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                >
                  {APPLICATION_SOURCES.map((src) => (
                    <option key={src} value={src}>
                      {src}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location || ''}
                  onChange={handleChange}
                  placeholder="e.g., Taguig / Remote"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Salary / Allowance
                </label>
                <input
                  type="text"
                  name="salary"
                  value={formData.salary || ''}
                  onChange={handleChange}
                  placeholder="e.g., $60,000 / yr or ₱35,000 / mo"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Dates & Reminders */}
        {activeTab === 'dates' && (
          <div className="space-y-4 animate-in fade-in duration-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Interview Date & Time
                </label>
                <input
                  type="datetime-local"
                  name="interviewDate"
                  value={formData.interviewDate || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Shows in your calendar and upcoming reminders.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Test / Assignment Due Date
                </label>
                <input
                  type="datetime-local"
                  name="assessmentDate"
                  value={formData.assessmentDate || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Follow-up Date
              </label>
              <input
                type="date"
                name="followUpDate"
                value={formData.followUpDate || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Reminds you to check in with the hiring manager or recruiter.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Notes & Preparation
              </label>
              <textarea
                name="notes"
                rows={3}
                value={formData.notes || ''}
                onChange={handleChange}
                placeholder="Tech stack, questions to ask, key points from the interview..."
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              />
            </div>
          </div>
        )}

        {/* Tab 3: Recruiter & Links */}
        {activeTab === 'recruiter' && (
          <div className="space-y-4 animate-in fade-in duration-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Job Posting URL
                </label>
                <input
                  type="url"
                  name="jobPostingUrl"
                  value={formData.jobPostingUrl || ''}
                  onChange={handleChange}
                  placeholder="https://linkedin.com/jobs/view/..."
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Company Website
                </label>
                <input
                  type="url"
                  name="companyWebsite"
                  value={formData.companyWebsite || ''}
                  onChange={handleChange}
                  placeholder="https://company.com"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Contact Person
                </label>
                <input
                  type="text"
                  name="recruiterName"
                  value={formData.recruiterName || ''}
                  onChange={handleChange}
                  placeholder="e.g., Sarah Smith"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Contact Email
                </label>
                <input
                  type="email"
                  name="recruiterEmail"
                  value={formData.recruiterEmail || ''}
                  onChange={handleChange}
                  placeholder="recruiter@company.com"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Contact Phone
                </label>
                <input
                  type="text"
                  name="recruiterContact"
                  value={formData.recruiterContact || ''}
                  onChange={handleChange}
                  placeholder="+1 555-0199"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* Action Controls Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            {activeTab !== 'general' && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  setActiveTab(activeTab === 'recruiter' ? 'dates' : 'general')
                }
              >
                Back
              </Button>
            )}
            {activeTab !== 'recruiter' && (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() =>
                  setActiveTab(activeTab === 'general' ? 'dates' : 'recruiter')
                }
              >
                Next →
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" size="sm" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              {isEditing ? 'Save Changes' : 'Save Application'}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};
