import React, { useState } from 'react';
import {
  ExternalLink,
  MoreVertical,
  Calendar,
  Building2,
  Trash2,
  Edit2,
  Eye,
  Clock,
} from 'lucide-react';
import { JobApplication, ApplicationStatus } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { formatDate, getDaysRemaining } from '../../utils/formatters';
import { APPLICATION_STATUSES } from '../../utils/constants';
import { useApplications } from '../../context/ApplicationContext';
import { ConfirmDialog } from '../common/ConfirmDialog';

interface ApplicationTableProps {
  applications: JobApplication[];
}

export const ApplicationTable: React.FC<ApplicationTableProps> = ({ applications }) => {
  const { openDrawer, openEditModal, deleteApplication, updateStatus } = useApplications();
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const handleDeleteConfirm = () => {
    if (deleteTargetId) {
      deleteApplication(deleteTargetId);
      setDeleteTargetId(null);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="bg-slate-50/80 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <th className="py-3.5 px-4">Company & Role</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4">Date Applied</th>
              <th className="py-3.5 px-4 hidden md:table-cell">Setup & Type</th>
              <th className="py-3.5 px-4 hidden lg:table-cell">Salary / Allowance</th>
              <th className="py-3.5 px-4 hidden xl:table-cell">Next Action / Event</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {applications.map((app) => {
              const followUpStatus = app.followUpDate
                ? getDaysRemaining(app.followUpDate)
                : null;

              return (
                <tr
                  key={app.id}
                  className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors group"
                >
                  {/* Company & Role */}
                  <td className="py-3.5 px-4">
                    <div
                      onClick={() => openDrawer(app.id)}
                      className="cursor-pointer"
                    >
                      <div className="font-semibold text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1.5">
                        <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
                        <span>{app.companyName}</span>
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {app.position}
                      </div>
                      {app.location && (
                        <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                          {app.location}
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Status Dropdown & Badge */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5">
                      <select
                        value={app.status}
                        onChange={(e) =>
                          updateStatus(app.id, e.target.value as ApplicationStatus)
                        }
                        className="opacity-0 w-0 h-0 absolute pointer-events-none"
                        id={`status-select-${app.id}`}
                      >
                        {APPLICATION_STATUSES.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => openDrawer(app.id)}
                        className="focus:outline-none cursor-pointer"
                        title="Click to view full application dossier & timeline"
                      >
                        <StatusBadge status={app.status} size="sm" />
                      </button>
                    </div>
                  </td>

                  {/* Date Applied */}
                  <td className="py-3.5 px-4 text-xs text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{formatDate(app.dateApplied)}</span>
                    </div>
                  </td>

                  {/* Work Setup & Employment Type */}
                  <td className="py-3.5 px-4 hidden md:table-cell text-xs">
                    <div className="text-slate-800 dark:text-slate-200 font-medium">
                      {app.workSetup || 'Not specified'}
                    </div>
                    <div className="text-[11px] text-slate-400 dark:text-slate-500">
                      {app.employmentType || '—'}
                    </div>
                  </td>

                  {/* Salary / Allowance */}
                  <td className="py-3.5 px-4 hidden lg:table-cell text-xs text-slate-700 dark:text-slate-300">
                    {app.salary ? (
                      <span className="font-medium">{app.salary}</span>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>

                  {/* Next Event / Reminders */}
                  <td className="py-3.5 px-4 hidden xl:table-cell text-xs">
                    {app.interviewDate ? (
                      <div className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-medium">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Interview: {formatDate(app.interviewDate)}</span>
                      </div>
                    ) : app.assessmentDate ? (
                      <div className="flex items-center gap-1 text-purple-600 dark:text-purple-400 font-medium">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Assessment: {formatDate(app.assessmentDate)}</span>
                      </div>
                    ) : followUpStatus ? (
                      <div
                        className={`text-xs ${
                          followUpStatus.isOverdue
                            ? 'text-rose-600 dark:text-rose-400 font-medium'
                            : 'text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        Follow-up: {followUpStatus.label}
                      </div>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>

                  {/* Actions column */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="relative inline-flex items-center justify-end gap-1">
                      {app.jobPostingUrl && (
                        <a
                          href={app.jobPostingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="Open original job posting URL"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}

                      <button
                        onClick={() => openDrawer(app.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="View details & timeline"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => openEditModal(app)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="Edit application"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => setDeleteTargetId(app.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="Delete application"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Job Application"
        message="Are you sure you want to permanently delete this application record? All related timeline entries and notes will also be removed."
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
};
