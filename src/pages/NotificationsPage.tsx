import React from 'react';
import {
  Bell,
  Check,
  Trash2,
  Calendar,
  Clock,
} from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';
import { formatDateTime } from '../utils/formatters';
import { Button } from '../components/common/Button';
import { EmptyState } from '../components/common/EmptyState';

interface NotificationsPageProps {
  onNavigate: (view: string) => void;
}

export const NotificationsPage: React.FC<NotificationsPageProps> = ({ onNavigate }) => {
  const {
    notifications,
    markAsRead,
    markAllAsRead,
    clearAllNotifications,
  } = useNotifications();

  const getIcon = (type: string) => {
    switch (type) {
      case 'interview':
        return <Calendar className="w-4 h-4 text-indigo-500" />;
      case 'assessment':
        return <Clock className="w-4 h-4 text-purple-500" />;
      case 'followup':
        return <Clock className="w-4 h-4 text-amber-500" />;
      default:
        return <Bell className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Notifications
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Reminders, interviews, and updates
          </p>
        </div>

        {notifications.length > 0 && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={markAllAsRead}
              icon={<Check className="w-3.5 h-3.5" />}
            >
              Mark All Read
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={clearAllNotifications}
              icon={<Trash2 className="w-3.5 h-3.5 text-rose-500" />}
            >
              Clear All
            </Button>
          </div>
        )}
      </div>

      {/* Notifications Feed */}
      {notifications.length === 0 ? (
        <EmptyState
          title="No notifications"
          description="You are all caught up."
          icon={<Bell className="w-8 h-8 text-slate-400" />}
        />
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden">
          {notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => {
                if (!n.read) markAsRead(n.id);
                if (n.type === 'interview' || n.type === 'assessment' || n.type === 'followup') {
                  onNavigate('calendar');
                }
              }}
              className={`p-4 sm:p-5 flex items-start gap-4 transition-colors cursor-pointer ${
                n.read
                  ? 'opacity-70 hover:opacity-100 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                  : 'bg-indigo-50/30 dark:bg-indigo-950/20 hover:bg-indigo-50/50'
              }`}
            >
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0 shadow-xs">
                {getIcon(n.type)}
              </div>

              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                    {n.title}
                  </h4>
                  <span className="text-[10px] text-slate-400 shrink-0 font-medium">
                    {formatDateTime(n.createdAt)}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {n.message}
                </p>
              </div>

              {!n.read && (
                <div className="w-2.5 h-2.5 rounded-full bg-indigo-600 dark:bg-indigo-400 shrink-0 mt-1.5" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
