import React, { useState } from 'react';
import {
  Clock,
  Calendar,
  AlertCircle,
  ChevronRight,
  FileCheck,
  CheckCircle2,
  ListTodo,
} from 'lucide-react';
import { ReminderItem } from '../../types';
import { formatDateShort } from '../../utils/formatters';

interface UpcomingRemindersProps {
  reminders: {
    all: ReminderItem[];
    overdue: ReminderItem[];
    today: ReminderItem[];
    upcoming: ReminderItem[];
  };
  onOpenApp: (id: string) => void;
  onViewCalendar: () => void;
}

export const UpcomingReminders: React.FC<UpcomingRemindersProps> = ({
  reminders,
  onOpenApp,
  onViewCalendar,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'today' | 'upcoming' | 'overdue'>('all');

  const displayedList =
    activeTab === 'all'
      ? reminders.all
      : activeTab === 'today'
      ? reminders.today
      : activeTab === 'overdue'
      ? reminders.overdue
      : reminders.upcoming;

  const getReminderIcon = (type: ReminderItem['type']) => {
    switch (type) {
      case 'interview':
        return <Calendar className="w-3.5 h-3.5 text-indigo-500" />;
      case 'assessment':
        return <FileCheck className="w-3.5 h-3.5 text-purple-500" />;
      case 'followup':
        return <Clock className="w-3.5 h-3.5 text-amber-500" />;
      default:
        return <AlertCircle className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  return (
    <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <ListTodo className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>Reminders & Schedule</span>
            <span className="ml-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
              {reminders.all.length}
            </span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Upcoming interviews, tests, and follow-ups
          </p>
        </div>
        <button
          onClick={onViewCalendar}
          className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline flex items-center gap-0.5 cursor-pointer"
        >
          <span>Calendar</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl text-xs">
        <button
          onClick={() => setActiveTab('all')}
          className={`flex-1 py-1 px-2 rounded-lg font-medium transition-colors cursor-pointer ${
            activeTab === 'all'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          All ({reminders.all.length})
        </button>
        <button
          onClick={() => setActiveTab('today')}
          className={`flex-1 py-1 px-2 rounded-lg font-medium transition-colors cursor-pointer ${
            activeTab === 'today'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          Today ({reminders.today.length})
        </button>
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`flex-1 py-1 px-2 rounded-lg font-medium transition-colors cursor-pointer ${
            activeTab === 'upcoming'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          Upcoming ({reminders.upcoming.length})
        </button>
        {reminders.overdue.length > 0 && (
          <button
            onClick={() => setActiveTab('overdue')}
            className={`flex-1 py-1 px-2 rounded-lg font-medium transition-colors cursor-pointer ${
              activeTab === 'overdue'
                ? 'bg-rose-500 text-white shadow-xs font-semibold'
                : 'text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40'
            }`}
          >
            Overdue ({reminders.overdue.length})
          </button>
        )}
      </div>

      {/* List Content */}
      {displayedList.length === 0 ? (
        <div className="py-8 text-center text-xs text-slate-400 dark:text-slate-500 flex flex-col items-center justify-center gap-1.5">
          <CheckCircle2 className="w-5 h-5 text-emerald-500/70" />
          <span>No reminders in this category.</span>
        </div>
      ) : (
        <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
          {displayedList.map((item) => (
            <div
              key={item.id}
              onClick={() => onOpenApp(item.applicationId)}
              className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                item.isOverdue
                  ? 'border-rose-200 dark:border-rose-900/60 bg-rose-50/40 dark:bg-rose-950/20 hover:bg-rose-50/80 dark:hover:bg-rose-950/40'
                  : item.isToday
                  ? 'border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/40 dark:bg-indigo-950/20 hover:bg-indigo-50/80 dark:hover:bg-indigo-950/40'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/30 hover:bg-slate-100/60 dark:hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-start gap-2.5 min-w-0">
                <div className="p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0 mt-0.5 shadow-xs">
                  {getReminderIcon(item.type)}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {item.title}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    {item.companyName} • {item.position}
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0">
                <div
                  className={`text-[11px] font-bold ${
                    item.isOverdue
                      ? 'text-rose-600 dark:text-rose-400'
                      : item.isToday
                      ? 'text-indigo-600 dark:text-indigo-400'
                      : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {formatDateShort(item.date)}
                </div>
                <span className="text-[10px] text-slate-400">
                  {item.isOverdue ? 'Overdue' : item.isToday ? 'Today' : 'Upcoming'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
