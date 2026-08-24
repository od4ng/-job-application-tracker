import React from 'react';
import {
  Calendar,
  Clock,
  ExternalLink,
  MoreVertical,
  MapPin,
  Banknote,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  FileCheck,
} from 'lucide-react';
import { JobApplication, ApplicationStatus } from '../../types';
import { useApplications } from '../../context/ApplicationContext';
import { StatusBadge } from '../common/StatusBadge';
import { formatDateShort } from '../../utils/formatters';

interface ApplicationBoardProps {
  applications: JobApplication[];
}

interface ColumnConfig {
  id: string;
  title: string;
  statuses: ApplicationStatus[];
  color: string;
  badgeBg: string;
  badgeText: string;
  icon: React.ReactNode;
}

const COLUMNS: ColumnConfig[] = [
  {
    id: 'col-saved',
    title: 'Saved / Wishlist',
    statuses: ['Saved'],
    color: 'border-slate-300 dark:border-slate-700',
    badgeBg: 'bg-slate-100 dark:bg-slate-800',
    badgeText: 'text-slate-600 dark:text-slate-300',
    icon: <Sparkles className="w-3.5 h-3.5 text-slate-500" />,
  },
  {
    id: 'col-applied',
    title: 'Applied',
    statuses: ['Applied'],
    color: 'border-blue-300 dark:border-blue-800',
    badgeBg: 'bg-blue-50 dark:bg-blue-950/50',
    badgeText: 'text-blue-700 dark:text-blue-300',
    icon: <Clock className="w-3.5 h-3.5 text-blue-500" />,
  },
  {
    id: 'col-screening',
    title: 'Screening',
    statuses: ['Screening'],
    color: 'border-cyan-300 dark:border-cyan-800',
    badgeBg: 'bg-cyan-50 dark:bg-cyan-950/50',
    badgeText: 'text-cyan-700 dark:text-cyan-300',
    icon: <AlertCircle className="w-3.5 h-3.5 text-cyan-500" />,
  },
  {
    id: 'col-interviewing',
    title: 'Interviews & Tests',
    statuses: ['Interview', 'Assessment', 'Final Interview'],
    color: 'border-indigo-300 dark:border-indigo-800',
    badgeBg: 'bg-indigo-50 dark:bg-indigo-950/50',
    badgeText: 'text-indigo-700 dark:text-indigo-300',
    icon: <Calendar className="w-3.5 h-3.5 text-indigo-500" />,
  },
  {
    id: 'col-offers',
    title: 'Offers & Hired',
    statuses: ['Offer', 'Hired'],
    color: 'border-emerald-300 dark:border-emerald-800',
    badgeBg: 'bg-emerald-50 dark:bg-emerald-950/50',
    badgeText: 'text-emerald-700 dark:text-emerald-300',
    icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />,
  },
  {
    id: 'col-closed',
    title: 'Closed / Inactive',
    statuses: ['Rejected', 'Withdrawn'],
    color: 'border-slate-200 dark:border-slate-800',
    badgeBg: 'bg-rose-50 dark:bg-rose-950/40',
    badgeText: 'text-rose-700 dark:text-rose-300',
    icon: <HelpCircle className="w-3.5 h-3.5 text-rose-400" />,
  },
];

export const ApplicationBoard: React.FC<ApplicationBoardProps> = ({ applications }) => {
  const { openDrawer, updateStatus } = useApplications();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 items-start overflow-x-auto pb-4">
      {COLUMNS.map((column) => {
        const columnApps = applications.filter((app) => column.statuses.includes(app.status));

        return (
          <div
            key={column.id}
            className="flex flex-col rounded-2xl bg-slate-50/70 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/80 p-3 min-w-[260px] max-w-full"
          >
            {/* Column Header */}
            <div className="flex items-center justify-between px-1.5 py-1 mb-2.5">
              <div className="flex items-center gap-1.5">
                {column.icon}
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {column.title}
                </span>
              </div>
              <span
                className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${column.badgeBg} ${column.badgeText}`}
              >
                {columnApps.length}
              </span>
            </div>

            {/* Cards List */}
            <div className="space-y-2.5 min-h-[120px]">
              {columnApps.length === 0 ? (
                <div className="h-24 flex items-center justify-center border border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-[11px] text-slate-400">
                  No applications
                </div>
              ) : (
                columnApps.map((app) => (
                  <div
                    key={app.id}
                    onClick={() => openDrawer(app.id)}
                    className="p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-xs hover:shadow-md hover:border-indigo-400 dark:hover:border-indigo-500 transition-all cursor-pointer group relative"
                  >
                    {/* Top Row: Company & Status Badge */}
                    <div className="flex items-start justify-between gap-1.5 mb-1">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {app.companyName}
                      </h4>
                      <StatusBadge status={app.status} size="sm" />
                    </div>

                    {/* Position */}
                    <p className="text-[12px] font-medium text-slate-600 dark:text-slate-300 line-clamp-1 mb-2">
                      {app.position}
                    </p>

                    {/* Metadata tags */}
                    <div className="space-y-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                      {app.location && (
                        <div className="flex items-center gap-1 truncate">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate">{app.location}</span>
                        </div>
                      )}

                      {app.salary && (
                        <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium truncate">
                          <Banknote className="w-3 h-3 shrink-0" />
                          <span className="truncate">{app.salary}</span>
                        </div>
                      )}
                    </div>

                    {/* Pill Badges for Urgent Reminders */}
                    <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center gap-1">
                      {app.workSetup && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
                          {app.workSetup}
                        </span>
                      )}

                      {app.interviewDate && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-medium flex items-center gap-0.5">
                          <Calendar className="w-2.5 h-2.5" />
                          <span>Int: {formatDateShort(app.interviewDate)}</span>
                        </span>
                      )}

                      {app.assessmentDate && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-medium flex items-center gap-0.5">
                          <FileCheck className="w-2.5 h-2.5" />
                          <span>Test: {formatDateShort(app.assessmentDate)}</span>
                        </span>
                      )}

                      {app.followUpDate && !app.interviewDate && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 font-medium flex items-center gap-0.5">
                          <Clock className="w-2.5 h-2.5" />
                          <span>F/U: {formatDateShort(app.followUpDate)}</span>
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
