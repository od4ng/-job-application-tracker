import React from 'react';
import { ApplicationStatus } from '../../types';
import { APPLICATION_STATUSES, STATUS_CONFIG } from '../../utils/constants';

interface StatusChartProps {
  statusCounts: Record<string, number>;
  total: number;
}

export const StatusChart: React.FC<StatusChartProps> = ({ statusCounts, total }) => {
  if (total === 0) {
    return (
      <div className="p-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-center text-xs text-slate-400">
        No application data recorded yet.
      </div>
    );
  }

  const activeStatuses = APPLICATION_STATUSES.filter(
    (st) => (statusCounts[st] || 0) > 0
  );

  return (
    <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
            Application Status
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {total} total applications
          </p>
        </div>
      </div>

      {/* Progress segmented multi-bar */}
      <div className="h-3 w-full rounded-full bg-slate-100 dark:bg-slate-800 flex overflow-hidden gap-0.5">
        {activeStatuses.map((st) => {
          const count = statusCounts[st] || 0;
          const percentage = (count / total) * 100;
          const config = STATUS_CONFIG[st as ApplicationStatus];
          return (
            <div
              key={st}
              style={{ width: `${percentage}%` }}
              className={`${config.dotColor} transition-all duration-300 hover:opacity-80`}
              title={`${st}: ${count} (${Math.round(percentage)}%)`}
            />
          );
        })}
      </div>

      {/* Grid of status items with percentage indicators */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
        {activeStatuses.map((st) => {
          const count = statusCounts[st] || 0;
          const percentage = Math.round((count / total) * 100);
          const config = STATUS_CONFIG[st as ApplicationStatus];
          return (
            <div
              key={st}
              className="p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-between"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className={`w-2 h-2 rounded-full ${config.dotColor} shrink-0`} />
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate">
                  {st}
                </span>
              </div>
              <div className="text-xs font-bold text-slate-900 dark:text-white ml-2">
                {count}{' '}
                <span className="text-[10px] font-normal text-slate-400">
                  ({percentage}%)
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
