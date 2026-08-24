import React from 'react';
import {
  Briefcase,
  Calendar,
  CheckCircle2,
  Clock,
  Plus,
  User as UserIcon,
  TrendingUp,
  FileCheck,
  Sparkles,
  ArrowRight,
  Archive,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApplications } from '../context/ApplicationContext';
import { StatCard } from '../components/dashboard/StatCard';
import { StatusChart } from '../components/dashboard/StatusChart';
import { UpcomingReminders } from '../components/dashboard/UpcomingReminders';
import { RecentActivityList } from '../components/dashboard/RecentActivityList';
import { DynamicInsightsBanner } from '../components/dashboard/DynamicInsightsBanner';
import { Button } from '../components/common/Button';
import { APPLICATION_STATUSES, STATUS_CONFIG } from '../utils/constants';
import { ApplicationStatus } from '../types';

interface DashboardPageProps {
  onNavigate: (view: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const {
    applications,
    analytics,
    reminders,
    insights,
    openAddModal,
    openDrawer,
    setFilters,
  } = useApplications();

  const handleStatusFilterClick = (status: ApplicationStatus) => {
    setFilters((prev) => ({ ...prev, status }));
    onNavigate('applications');
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50 dark:bg-slate-900/60 p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Welcome back, {user?.name.split(' ')[0]}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Target role: <span className="font-medium text-slate-800 dark:text-slate-200">{user?.preferredRole || 'Software Engineer'}</span> • {applications.length} applications tracked
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate('settings')}
            icon={<UserIcon className="w-3.5 h-3.5" />}
          >
            Profile & Settings
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={openAddModal}
            icon={<Plus className="w-4 h-4" />}
          >
            Add Application
          </Button>
        </div>
      </div>

      {/* Dynamic Insights Banner */}
      {insights.length > 0 && <DynamicInsightsBanner insights={insights} />}

      {/* Core Funnel High-level Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          label="Total Applications"
          value={analytics.total}
          subtitle={`${analytics.activeApplications} in progress`}
          icon={<Briefcase className="w-5 h-5" />}
          colorScheme="indigo"
          onClick={() => {
            setFilters((prev) => ({ ...prev, status: 'All' }));
            onNavigate('applications');
          }}
        />

        <StatCard
          label="Interviews"
          value={analytics.interviewCount}
          subtitle={`${analytics.interviewRate}% of applications`}
          icon={<Calendar className="w-5 h-5" />}
          colorScheme="cyan"
          onClick={() => onNavigate('calendar')}
        />

        <StatCard
          label="Offers"
          value={analytics.offerCount + analytics.hiredCount}
          subtitle={`${analytics.offerRate}% of applications`}
          icon={<CheckCircle2 className="w-5 h-5" />}
          colorScheme="emerald"
          onClick={() => {
            setFilters((prev) => ({ ...prev, status: 'Offer' }));
            onNavigate('applications');
          }}
        />

        <StatCard
          label="Upcoming Reminders"
          value={reminders.all.length}
          subtitle={
            reminders.overdue.length > 0
              ? `${reminders.overdue.length} need attention`
              : reminders.today.length > 0
              ? `${reminders.today.length} due today`
              : 'All caught up'
          }
          icon={<Clock className="w-5 h-5" />}
          colorScheme={reminders.overdue.length > 0 ? 'rose' : reminders.today.length > 0 ? 'amber' : 'slate'}
          onClick={() => onNavigate('calendar')}
        />
      </div>

      {/* 10-Status Pipeline Quick Navigation Bar */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Applications by Stage
          </h3>
          <span className="text-xs text-slate-400">Click to filter</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2">
          {APPLICATION_STATUSES.map((status) => {
            const count = analytics.byStatus[status] || 0;
            const config = STATUS_CONFIG[status];
            return (
              <button
                key={status}
                onClick={() => handleStatusFilterClick(status)}
                className="p-2.5 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/30 hover:bg-indigo-50/60 dark:hover:bg-indigo-950/40 hover:border-indigo-200 dark:hover:border-indigo-800 transition-all text-left group cursor-pointer"
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <span className={`w-2 h-2 rounded-full ${config.dotColor}`} />
                  <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                    {status}
                  </span>
                </div>
                <div className="text-sm font-bold text-slate-900 dark:text-white">
                  {count}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Pipeline Status Breakdown Chart */}
      <div>
        <StatusChart
          statusCounts={analytics.byStatus}
          total={analytics.total}
        />
      </div>

      {/* Reminders & Recent Applications Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UpcomingReminders
          reminders={reminders}
          onOpenApp={openDrawer}
          onViewCalendar={() => onNavigate('calendar')}
        />

        <RecentActivityList
          applications={applications.slice(0, 5)}
          onOpenApp={openDrawer}
          onViewAll={() => onNavigate('applications')}
        />
      </div>
    </div>
  );
};
