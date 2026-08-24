import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  Building2,
} from 'lucide-react';
import { JobApplication } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { formatDate, formatDateTime, getDaysRemaining } from '../../utils/formatters';

interface CalendarViewProps {
  applications: JobApplication[];
  onOpenApp: (id: string) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ applications, onOpenApp }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const monthName = currentDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  // Collect scheduled events per date key (YYYY-MM-DD)
  const eventsByDate: Record<
    string,
    { app: JobApplication; type: 'interview' | 'assessment' | 'followup' | 'applied'; dateStr: string }[]
  > = {};

  applications.forEach((app) => {
    if (app.interviewDate) {
      const key = app.interviewDate.split('T')[0];
      if (!eventsByDate[key]) eventsByDate[key] = [];
      eventsByDate[key].push({ app, type: 'interview', dateStr: app.interviewDate });
    }
    if (app.assessmentDate) {
      const key = app.assessmentDate.split('T')[0];
      if (!eventsByDate[key]) eventsByDate[key] = [];
      eventsByDate[key].push({ app, type: 'assessment', dateStr: app.assessmentDate });
    }
    if (app.followUpDate) {
      const key = app.followUpDate.split('T')[0];
      if (!eventsByDate[key]) eventsByDate[key] = [];
      eventsByDate[key].push({ app, type: 'followup', dateStr: app.followUpDate });
    }
  });

  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanksArray = Array.from({ length: firstDayIndex }, (_, i) => i);

  const todayKey = new Date().toISOString().split('T')[0];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
      {/* Calendar Header Navigation */}
      <div className="p-4 sm:p-5 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            {monthName}
          </h3>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setCurrentDate(new Date())}
            className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition-colors"
          >
            Today
          </button>
          <button
            onClick={prevMonth}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50"
            aria-label="Previous Month"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={nextMonth}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50"
            aria-label="Next Month"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Weekday Labels */}
      <div className="grid grid-cols-7 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-center text-xs font-semibold text-slate-400 dark:text-slate-500 py-2.5">
        <div>Sun</div>
        <div>Mon</div>
        <div>Tue</div>
        <div>Wed</div>
        <div>Thu</div>
        <div>Fri</div>
        <div>Sat</div>
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-slate-100 dark:divide-slate-800 border-b border-slate-200 dark:border-slate-800">
        {/* Leading empty cells */}
        {blanksArray.map((_, i) => (
          <div key={`blank-${i}`} className="min-h-[90px] sm:min-h-[110px] bg-slate-50/30 dark:bg-slate-900/40 p-2 opacity-50" />
        ))}

        {/* Month Day Cells */}
        {daysArray.map((day) => {
          const monthFormatted = String(month + 1).padStart(2, '0');
          const dayFormatted = String(day).padStart(2, '0');
          const dateKey = `${year}-${monthFormatted}-${dayFormatted}`;
          const events = eventsByDate[dateKey] || [];
          const isToday = dateKey === todayKey;

          return (
            <div
              key={`day-${day}`}
              className={`min-h-[90px] sm:min-h-[110px] p-2 flex flex-col justify-between transition-colors ${
                isToday
                  ? 'bg-indigo-50/40 dark:bg-indigo-950/20 ring-1 ring-inset ring-indigo-500/30'
                  : 'hover:bg-slate-50/50 dark:hover:bg-slate-800/20'
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center ${
                    isToday
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {day}
                </span>
                {events.length > 0 && (
                  <span className="text-[10px] text-slate-400 font-medium hidden sm:inline">
                    {events.length} {events.length === 1 ? 'event' : 'events'}
                  </span>
                )}
              </div>

              {/* Event Tags inside the cell */}
              <div className="space-y-1 mt-1 overflow-y-auto max-h-16">
                {events.map((ev, idx) => {
                  const tagStyles =
                    ev.type === 'interview'
                      ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800'
                      : ev.type === 'assessment'
                      ? 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800'
                      : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800';

                  return (
                    <div
                      key={idx}
                      onClick={() => ev.app?.id && onOpenApp(ev.app.id)}
                      className={`text-[10px] px-1.5 py-0.5 rounded border ${tagStyles} truncate cursor-pointer font-medium hover:opacity-80 transition-opacity`}
                      title={`${ev.type.toUpperCase()}: ${ev.app?.companyName || ''} (${ev.app?.position || ''})`}
                    >
                      {ev.type === 'interview' ? '🎤 ' : ev.type === 'assessment' ? '📝 ' : '🔔 '}
                      {ev.app?.companyName || 'Application'}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
