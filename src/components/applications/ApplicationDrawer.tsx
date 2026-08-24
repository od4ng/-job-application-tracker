import React, { useState } from 'react';
import {
  Building2,
  Calendar,
  MapPin,
  Clock,
  ExternalLink,
  Edit2,
  Trash2,
  DollarSign,
  User,
  Mail,
  Phone,
  Briefcase,
  Share2,
} from 'lucide-react';
import { Drawer } from '../common/Drawer';
import { StatusBadge } from '../common/StatusBadge';
import { Button } from '../common/Button';
import { formatDate, formatDateTime, getDaysRemaining } from '../../utils/formatters';
import { APPLICATION_STATUSES } from '../../utils/constants';
import { ApplicationStatus } from '../../types';
import { useApplications } from '../../context/ApplicationContext';
import { ApplicationTimeline } from './ApplicationTimeline';
import { ConfirmDialog } from '../common/ConfirmDialog';

interface ApplicationDrawerProps {
  onNavigate?: (view: string) => void;
}

export const ApplicationDrawer: React.FC<ApplicationDrawerProps> = () => {
  const {
    activeAppId,
    selectedApplication,
    selectedAppTimeline,
    closeDrawer,
    openEditModal,
    deleteApplication,
    updateStatus,
  } = useApplications();

  const [activeTab, setActiveTab] = useState<'overview' | 'timeline' | 'notes'>('overview');
  const [isDeleting, setIsDeleting] = useState(false);
  const [statusUpdateNote, setStatusUpdateNote] = useState('');
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [targetStatus, setTargetStatus] = useState<ApplicationStatus | null>(null);

  if (!selectedApplication) return null;

  const app = selectedApplication;
  const followUpStatus = app.followUpDate ? getDaysRemaining(app.followUpDate) : null;

  const handleStatusChangeClick = (st: ApplicationStatus) => {
    if (st === app.status) return;
    setTargetStatus(st);
    setShowStatusModal(true);
  };

  const handleStatusConfirm = () => {
    if (targetStatus) {
      updateStatus(app.id, targetStatus, statusUpdateNote);
      setShowStatusModal(false);
      setStatusUpdateNote('');
    }
  };

  const handleDelete = () => {
    deleteApplication(app.id);
    setIsDeleting(false);
    closeDrawer();
  };

  return (
    <>
      <Drawer
        isOpen={!!activeAppId}
        onClose={closeDrawer}
        width="xl"
        title={
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
            <span className="truncate">{app.companyName}</span>
          </div>
        }
        subtitle={
          <div className="flex items-center gap-2 mt-1">
            <span className="font-medium text-slate-700 dark:text-slate-300">
              {app.position}
            </span>
            <span>•</span>
            <StatusBadge status={app.status} size="sm" />
          </div>
        }
        footer={
          <div className="flex items-center justify-between gap-3">
            <Button
              variant="outline"
              size="sm"
              icon={<Trash2 className="w-3.5 h-3.5 text-rose-500" />}
              onClick={() => setIsDeleting(true)}
            >
              Delete
            </Button>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                icon={<Edit2 className="w-3.5 h-3.5" />}
                onClick={() => {
                  closeDrawer();
                  openEditModal(app);
                }}
              >
                Edit Application
              </Button>
              <Button variant="outline" size="sm" onClick={closeDrawer}>
                Close
              </Button>
            </div>
          </div>
        }
      >
        <div className="space-y-6">
          {/* Quick Status Bar Pipeline */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
              Status Stage
            </label>
            <div className="flex flex-wrap gap-1.5 p-2 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800">
              {APPLICATION_STATUSES.map((st) => {
                const isActive = st === app.status;
                return (
                  <button
                    key={st}
                    onClick={() => handleStatusChangeClick(st)}
                    className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all cursor-pointer ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {st}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Drawer Content Tabs */}
          <div className="flex border-b border-slate-200 dark:border-slate-800 gap-4 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('overview')}
              className={`pb-2 transition-colors cursor-pointer ${
                activeTab === 'overview'
                  ? 'border-b-2 border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold'
                  : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              Details
            </button>
            <button
              onClick={() => setActiveTab('timeline')}
              className={`pb-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'timeline'
                  ? 'border-b-2 border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold'
                  : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              <span>History</span>
              <span className="px-1.5 py-0.2 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px]">
                {selectedAppTimeline.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('notes')}
              className={`pb-2 transition-colors cursor-pointer ${
                activeTab === 'notes'
                  ? 'border-b-2 border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold'
                  : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              Notes
            </button>
          </div>

          {/* Tab 1: Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Top Key Info Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800">
                  <div className="text-[11px] text-slate-400">Date Applied</div>
                  <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                    {formatDate(app.dateApplied)}
                  </div>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800">
                  <div className="text-[11px] text-slate-400">Work Setup</div>
                  <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                    {app.workSetup || 'Not specified'}
                  </div>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800">
                  <div className="text-[11px] text-slate-400">Type</div>
                  <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                    {app.employmentType || 'Full-time'}
                  </div>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800">
                  <div className="text-[11px] text-slate-400">Salary</div>
                  <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5">
                    {app.salary || 'Undisclosed'}
                  </div>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800">
                  <div className="text-[11px] text-slate-400">Source</div>
                  <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                    {app.applicationSource || 'Direct'}
                  </div>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800">
                  <div className="text-[11px] text-slate-400">Location</div>
                  <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-0.5 truncate">
                    {app.location || 'Remote'}
                  </div>
                </div>
              </div>

              {/* Schedule and Reminders Box */}
              <div className="p-4 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 space-y-3">
                <h4 className="text-xs font-bold text-indigo-900 dark:text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Important Dates & Deadlines</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500 dark:text-slate-400">Interview:</span>{' '}
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {app.interviewDate ? formatDateTime(app.interviewDate) : 'Not scheduled'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400">Test / Assignment:</span>{' '}
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {app.assessmentDate ? formatDateTime(app.assessmentDate) : 'None'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400">Follow-up:</span>{' '}
                    <span
                      className={`font-semibold ${
                        followUpStatus?.isOverdue
                          ? 'text-rose-600 dark:text-rose-400'
                          : 'text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      {app.followUpDate ? formatDate(app.followUpDate) : 'None set'}
                      {followUpStatus && ` (${followUpStatus.label})`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Recruiter & Contact Information */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Contact Person
                </h4>
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-slate-500">Name:</span>
                    <span className="font-medium text-slate-800 dark:text-slate-200">
                      {app.recruiterName || 'Not specified'}
                    </span>
                  </div>
                  {app.recruiterEmail && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-slate-500">Email:</span>
                      <a
                        href={`mailto:${app.recruiterEmail}`}
                        className="text-indigo-600 dark:text-indigo-400 hover:underline"
                      >
                        {app.recruiterEmail}
                      </a>
                    </div>
                  )}
                  {app.recruiterContact && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-slate-500">Phone:</span>
                      <span className="text-slate-800 dark:text-slate-200">
                        {app.recruiterContact}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Job Posting & Web Links */}
              {(app.jobPostingUrl || app.companyWebsite) && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    Links
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {app.jobPostingUrl && (
                      <a
                        href={app.jobPostingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-indigo-500" />
                        <span>Job Posting</span>
                      </a>
                    )}
                    {app.companyWebsite && (
                      <a
                        href={app.companyWebsite}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                        <span>Company Website</span>
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Activity Timeline */}
          {activeTab === 'timeline' && (
            <ApplicationTimeline
              applicationId={app.id}
              timeline={selectedAppTimeline}
            />
          )}

          {/* Tab 3: Notes */}
          {activeTab === 'notes' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Notes & Interview Prep
                </h4>
                {app.notes ? (
                  <p className="text-xs text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                    {app.notes}
                  </p>
                ) : (
                  <p className="text-xs text-slate-400 italic">
                    No notes added yet. Click "Edit Application" to add salary targets, interview questions, or next steps.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </Drawer>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleting}
        onClose={() => setIsDeleting(false)}
        onConfirm={handleDelete}
        title="Delete Job Application"
        message={`Are you sure you want to delete your application for ${app.position} at ${app.companyName}?`}
        confirmText="Delete"
        variant="danger"
      />

      {/* Status Change Note Modal */}
      {showStatusModal && targetStatus && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Update Status to "{targetStatus}"
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Add an optional note about what happened (e.g. passed interview, received take-home assignment).
            </p>
            <textarea
              value={statusUpdateNote}
              onChange={(e) => setStatusUpdateNote(e.target.value)}
              placeholder="e.g., Finished technical round, scheduling final interview..."
              rows={3}
              className="w-full p-2.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100"
            />
            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowStatusModal(false)}
              >
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleStatusConfirm}>
                Update Status
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
