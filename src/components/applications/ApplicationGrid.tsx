import React, { useState } from 'react';
import {
  Building2,
  Calendar,
  MapPin,
  Clock,
  ExternalLink,
  Edit2,
  Trash2,
  Eye,
  DollarSign,
} from 'lucide-react';
import { JobApplication, ApplicationStatus } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { formatDate, getDaysRemaining } from '../../utils/formatters';
import { APPLICATION_STATUSES } from '../../utils/constants';
import { useApplications } from '../../context/ApplicationContext';
import { ConfirmDialog } from '../common/ConfirmDialog';

interface ApplicationGridProps {
  applications: JobApplication[];
}

export const ApplicationGrid: React.FC<ApplicationGridProps> = ({ applications }) => {
  const { openDrawer, openEditModal, deleteApplication, updateStatus } = useApplications();
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const handleDeleteConfirm = () => {
    if (deleteTargetId) {
      deleteApplication(deleteTargetId);
      setDeleteTargetId(null);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
      {applications.map((app) => {
        const followUpStatus = app.followUpDate
          ? getDaysRemaining(app.followUpDate)
          : null;

        return (
          <div
            key={app.id}
            className="group flex flex-col justify-between rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all"
          >
            {/* Header */}
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="min-w-0 flex-1">
                  <div
                    onClick={() => openDrawer(app.id)}
                    className="font-bold text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-base truncate cursor-pointer"
                  >
                    {app.companyName}
                  </div>
                  <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                    {app.position}
                  </div>
                </div>
                <div className="shrink-0">
                  <StatusBadge status={app.status} size="sm" />
                </div>
              </div>

              {/* Badges / Meta Info */}
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-4">
                {app.location && (
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>{app.location}</span>
                  </span>
                )}
                {app.workSetup && (
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-medium text-slate-700 dark:text-slate-300">
                    {app.workSetup}
                  </span>
                )}
                {app.employmentType && (
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-medium text-slate-700 dark:text-slate-300">
                    {app.employmentType}
                  </span>
                )}
              </div>

              {/* Salary / Compensation */}
              {app.salary && (
                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-3 bg-emerald-50/50 dark:bg-emerald-950/20 px-2.5 py-1 rounded-lg w-fit">
                  <DollarSign className="w-3.5 h-3.5" />
                  <span>{app.salary}</span>
                </div>
              )}

              {/* Notes Snippet */}
              {app.notes && (
                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 italic mb-4 bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
                  "{app.notes}"
                </p>
              )}

              {/* Important Timeline / Reminder Alerts */}
              {(app.interviewDate || app.assessmentDate || followUpStatus) && (
                <div className="space-y-1.5 mb-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                  {app.interviewDate && (
                    <div className="flex items-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Interview: {formatDate(app.interviewDate)}</span>
                    </div>
                  )}
                  {app.assessmentDate && (
                    <div className="flex items-center gap-1.5 text-xs text-purple-600 dark:text-purple-400 font-medium">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Assessment: {formatDate(app.assessmentDate)}</span>
                    </div>
                  )}
                  {followUpStatus && (
                    <div
                      className={`text-xs ${
                        followUpStatus.isOverdue
                          ? 'text-rose-600 dark:text-rose-400 font-medium'
                          : 'text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      Follow-up: {followUpStatus.label}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer with Applied Date & Quick Controls */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between mt-2">
              <div className="flex items-center gap-1 text-xs text-slate-400">
                <Calendar className="w-3.5 h-3.5" />
                <span>Applied {formatDate(app.dateApplied)}</span>
              </div>

              <div className="flex items-center gap-1">
                {app.jobPostingUrl && (
                  <a
                    href={app.jobPostingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="View original listing"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}

                <button
                  onClick={() => openDrawer(app.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title="View details"
                >
                  <Eye className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => openEditModal(app)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title="Edit application"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => setDeleteTargetId(app.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title="Delete application"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        );
      })}

      <ConfirmDialog
        isOpen={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Job Application"
        message="Are you sure you want to remove this job application? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
};
