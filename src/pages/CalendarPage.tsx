import React from 'react';
import { Calendar as CalendarIcon, Clock, AlertCircle, FileCheck } from 'lucide-react';
import { useApplications } from '../context/ApplicationContext';
import { CalendarView } from '../components/calendar/CalendarView';
import { formatDate, formatDateTime, getDaysRemaining } from '../utils/formatters';

export const CalendarPage: React.FC = () => {
  const { applications, reminders, openDrawer } = useApplications();

  const interviewReminders = reminders.all.filter((r) => r.type === 'interview');
  const assessmentReminders = reminders.all.filter((r) => r.type === 'assessment');
  const followUpReminders = reminders.all.filter((r) => r.type === 'followup');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
          Schedule & Deadlines
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Keep track of your interviews, tests, and follow-up dates
        </p>
      </div>

      {/* Main Grid: Calendar on Left/Top, Detailed Agenda on Right/Bottom */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar (2 cols) */}
        <div className="lg:col-span-2">
          <CalendarView applications={applications} onOpenApp={openDrawer} />
        </div>

        {/* Actionable Agenda Stream (1 col) */}
        <div className="space-y-4">
          {/* Interviews Box */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
              <CalendarIcon className="w-3.5 h-3.5" />
              <span>Interviews ({interviewReminders.length})</span>
            </h3>

            {interviewReminders.length === 0 ? (
              <p className="text-xs text-slate-400 py-2">No interviews currently scheduled.</p>
            ) : (
              <div className="space-y-2">
                {interviewReminders.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => openDrawer(item.applicationId)}
                    className="p-2.5 rounded-xl border border-indigo-100 dark:border-indigo-950 bg-indigo-50/50 dark:bg-indigo-950/20 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors cursor-pointer"
                  >
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      {item.companyName}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      {item.position}
                    </div>
                    <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mt-1">
                      {formatDateTime(item.date)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Assessments Box */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
              <FileCheck className="w-3.5 h-3.5" />
              <span>Technical Tests ({assessmentReminders.length})</span>
            </h3>

            {assessmentReminders.length === 0 ? (
              <p className="text-xs text-slate-400 py-2">No upcoming tests or assignments.</p>
            ) : (
              <div className="space-y-2">
                {assessmentReminders.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => openDrawer(item.applicationId)}
                    className="p-2.5 rounded-xl border border-purple-100 dark:border-purple-950 bg-purple-50/50 dark:bg-purple-950/20 hover:bg-purple-50 dark:hover:bg-purple-950/40 transition-colors cursor-pointer"
                  >
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      {item.companyName}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      {item.position}
                    </div>
                    <div className="text-xs font-semibold text-purple-600 dark:text-purple-400 mt-1">
                      Due: {formatDate(item.date)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Follow-ups Box */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Follow-ups ({followUpReminders.length})</span>
            </h3>

            {followUpReminders.length === 0 ? (
              <p className="text-xs text-slate-400 py-2">No follow-ups due.</p>
            ) : (
              <div className="space-y-2">
                {followUpReminders.map((item) => {
                  const status = getDaysRemaining(item.date);
                  return (
                    <div
                      key={item.id}
                      onClick={() => openDrawer(item.applicationId)}
                      className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
                        status.isOverdue
                          ? 'border-rose-200 dark:border-rose-900 bg-rose-50/50 dark:bg-rose-950/20 hover:bg-rose-50'
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 hover:bg-slate-100'
                      }`}
                    >
                      <div className="text-xs font-bold text-slate-900 dark:text-white">
                        {item.companyName}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        {item.position}
                      </div>
                      <div
                        className={`text-xs font-semibold mt-1 ${
                          status.isOverdue
                            ? 'text-rose-600 dark:text-rose-400'
                            : 'text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        Target: {formatDate(item.date)} ({status.label})
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
