import React from 'react';
import {
  Plus,
  LayoutGrid,
  List,
  Kanban,
  Download,
  Briefcase,
} from 'lucide-react';
import { useApplications } from '../context/ApplicationContext';
import { useAuth } from '../context/AuthContext';
import { ApplicationFilter } from '../components/applications/ApplicationFilter';
import { ApplicationTable } from '../components/applications/ApplicationTable';
import { ApplicationGrid } from '../components/applications/ApplicationGrid';
import { ApplicationBoard } from '../components/applications/ApplicationBoard';
import { EmptyState } from '../components/common/EmptyState';
import { Button } from '../components/common/Button';
import { backupService } from '../services/backupService';
import { useNotifications } from '../context/NotificationContext';

export const ApplicationsPage: React.FC = () => {
  const { user } = useAuth();
  const {
    filteredApplications,
    applications,
    openAddModal,
    viewMode,
    setViewMode,
    resetFilters,
  } = useApplications();
  const { addToast } = useNotifications();

  const handleExportCSV = () => {
    if (!user) return;
    try {
      backupService.downloadCSV(user.id, `jobtracker-${user.username}-applications.csv`);
      addToast('Applications exported to CSV successfully!', 'success');
    } catch (e) {
      addToast('Failed to export CSV', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Job Applications
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {applications.length} applications tracked • {applications.filter(a => a.status !== 'Rejected' && a.status !== 'Withdrawn' && a.status !== 'Hired').length} active in pipeline
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Toggle */}
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setViewMode('board')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'board'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
              }`}
              title="Board Pipeline View"
            >
              <Kanban className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'cards'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
              }`}
              title="Card Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            icon={<Download className="w-3.5 h-3.5" />}
            title="Download CSV"
          >
            Export
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

      {/* Filter and Search Bar */}
      <ApplicationFilter
        viewMode={viewMode}
        onToggleViewMode={(mode) => setViewMode(mode)}
      />

      {/* Application List Display */}
      {applications.length === 0 ? (
        <EmptyState
          title="No applications yet"
          description="Start tracking your job search by adding your first job application."
          actionLabel="Add Your First Application"
          onAction={openAddModal}
          icon={<Briefcase className="w-8 h-8 text-indigo-500" />}
        />
      ) : filteredApplications.length === 0 ? (
        <EmptyState
          title="No matching applications found"
          description="Try modifying your search criteria or clearing your filters."
          actionLabel="Clear Filters"
          onAction={resetFilters}
        />
      ) : viewMode === 'board' ? (
        <ApplicationBoard applications={filteredApplications} />
      ) : viewMode === 'table' ? (
        <ApplicationTable applications={filteredApplications} />
      ) : (
        <ApplicationGrid applications={filteredApplications} />
      )}
    </div>
  );
};
