import React from 'react';
import {
  Search,
  SlidersHorizontal,
  LayoutGrid,
  List,
  Kanban,
  RotateCcw,
  Plus,
} from 'lucide-react';
import { useApplications, ViewMode } from '../../context/ApplicationContext';
import {
  APPLICATION_STATUSES,
  WORK_SETUPS,
  EMPLOYMENT_TYPES,
  APPLICATION_SOURCES,
} from '../../utils/constants';
import { ApplicationStatus, ApplicationSource, EmploymentType, WorkSetup, SortByOption } from '../../types';

interface ApplicationFilterProps {
  viewMode: ViewMode;
  onToggleViewMode: (mode: ViewMode) => void;
}

export const ApplicationFilter: React.FC<ApplicationFilterProps> = ({
  viewMode,
  onToggleViewMode,
}) => {
  const { filters, setFilters, resetFilters, openAddModal, filteredApplications, applications } =
    useApplications();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, search: e.target.value }));
  };

  const isFiltered =
    filters.search !== '' ||
    filters.status !== 'All' ||
    filters.workSetup !== 'All' ||
    filters.employmentType !== 'All' ||
    filters.applicationSource !== 'All' ||
    filters.sortBy !== 'dateApplied' ||
    filters.sortOrder !== 'desc';

  return (
    <div className="space-y-3 mb-6">
      {/* Top Search & Action Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={filters.search}
            onChange={handleSearchChange}
            placeholder="Search company, role, location, recruiter, or notes..."
            className="w-full pl-10 pr-14 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
          {filters.search && (
            <button
              onClick={() => setFilters((prev) => ({ ...prev, search: '' }))}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            >
              Clear
            </button>
          )}
        </div>

        {/* View Toggle & New Application CTA */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Board / Table / Grid Toggle */}
          <div className="flex items-center p-1 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <button
              onClick={() => onToggleViewMode('board')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'board'
                  ? 'bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
              }`}
              title="Board Pipeline View"
              aria-label="Switch to Board View"
            >
              <Kanban className="w-4 h-4" />
            </button>
            <button
              onClick={() => onToggleViewMode('table')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
              }`}
              title="Table View"
              aria-label="Switch to Table View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => onToggleViewMode('cards')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'cards'
                  ? 'bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
              }`}
              title="Card Grid View"
              aria-label="Switch to Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

          {/* New Application CTA */}
          <button
            onClick={openAddModal}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Application</span>
          </button>
        </div>
      </div>

      {/* Filter Selectors Row */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mr-1">
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span className="font-medium">Filter:</span>
        </div>

        {/* Status Dropdown */}
        <select
          value={filters.status}
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              status: e.target.value as ApplicationStatus | 'All',
            }))
          }
          className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
        >
          <option value="All">All Statuses</option>
          {APPLICATION_STATUSES.map((st) => (
            <option key={st} value={st}>
              {st}
            </option>
          ))}
        </select>

        {/* Work Setup Dropdown */}
        <select
          value={filters.workSetup}
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              workSetup: e.target.value as WorkSetup | 'All',
            }))
          }
          className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
        >
          <option value="All">All Work Setups</option>
          {WORK_SETUPS.map((ws) => (
            <option key={ws} value={ws}>
              {ws}
            </option>
          ))}
        </select>

        {/* Employment Type Dropdown */}
        <select
          value={filters.employmentType}
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              employmentType: e.target.value as EmploymentType | 'All',
            }))
          }
          className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
        >
          <option value="All">All Types</option>
          {EMPLOYMENT_TYPES.map((et) => (
            <option key={et} value={et}>
              {et}
            </option>
          ))}
        </select>

        {/* Source Dropdown */}
        <select
          value={filters.applicationSource}
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              applicationSource: e.target.value as ApplicationSource | 'All',
            }))
          }
          className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
        >
          <option value="All">All Sources</option>
          {APPLICATION_SOURCES.map((src) => (
            <option key={src} value={src}>
              {src}
            </option>
          ))}
        </select>

        {/* Sort By Dropdown */}
        <div className="flex items-center gap-1 sm:ml-auto">
          <span className="text-xs text-slate-400">Sort:</span>
          <select
            value={`${filters.sortBy}-${filters.sortOrder}`}
            onChange={(e) => {
              const [sortBy, sortOrder] = e.target.value.split('-') as [
                SortByOption,
                'asc' | 'desc'
              ];
              setFilters((prev) => ({ ...prev, sortBy, sortOrder }));
            }}
            className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
          >
            <option value="dateApplied-desc">Date Applied (Newest)</option>
            <option value="dateApplied-asc">Date Applied (Oldest)</option>
            <option value="companyName-asc">Company (A–Z)</option>
            <option value="companyName-desc">Company (Z–A)</option>
            <option value="position-asc">Position (A–Z)</option>
            <option value="status-asc">Status Pipeline</option>
            <option value="updatedAt-desc">Recently Updated</option>
            <option value="followUpDate-asc">Upcoming Follow-up</option>
            <option value="interviewDate-asc">Upcoming Interview</option>
          </select>
        </div>

        {/* Reset Filter Button */}
        {isFiltered && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 transition-colors cursor-pointer"
            title="Reset filters"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Result Count Indicator */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
        <span>
          Showing{' '}
          <strong className="text-slate-800 dark:text-slate-200 font-semibold">
            {filteredApplications.length}
          </strong>{' '}
          of {applications.length} applications
        </span>
      </div>
    </div>
  );
};
