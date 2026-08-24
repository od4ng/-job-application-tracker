import React from 'react';
import { Building2, ChevronRight } from 'lucide-react';
import { JobApplication } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { formatDate } from '../../utils/formatters';

interface RecentActivityListProps {
  applications: JobApplication[];
  onOpenApp: (id: string) => void;
  onViewAll: () => void;
}

export const RecentActivityList: React.FC<RecentActivityListProps> = ({
  applications,
  onOpenApp,
  onViewAll,
}) => {
  return (
    <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
            Recent Applications
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Recently added or updated
          </p>
        </div>
        <button
          onClick={onViewAll}
          className="text-xs text-indigo-600 dark:text-indigo-400 font-medium hover:underline flex items-center gap-0.5"
        >
          <span>View All</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {applications.length === 0 ? (
        <div className="py-8 text-center text-xs text-slate-400">
          No recent applications found.
        </div>
      ) : (
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {applications.map((app) => (
            <div
              key={app.id}
              onClick={() => onOpenApp(app.id)}
              className="py-3 flex items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/40 px-2 rounded-lg transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 shrink-0">
                  <Building2 className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {app.companyName}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    {app.position} • Applied {formatDate(app.dateApplied)}
                  </div>
                </div>
              </div>
              <div className="shrink-0">
                <StatusBadge status={app.status} size="sm" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
