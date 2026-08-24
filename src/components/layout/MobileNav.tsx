import React from 'react';
import {
  LayoutDashboard,
  Briefcase,
  Calendar,
  BarChart3,
  X,
  PlusCircle,
  Bell,
  Settings,
  User as UserIcon,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApplications } from '../../context/ApplicationContext';
import { useNotifications } from '../../context/NotificationContext';

interface MobileNavProps {
  currentView: string;
  onNavigate: (view: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  currentView,
  onNavigate,
  isOpen,
  onClose,
}) => {
  const { logout } = useAuth();
  const { openAddModal, applications } = useApplications();
  const { unreadCount } = useNotifications();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'applications', label: 'Applications', icon: Briefcase, badge: applications.length },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: unreadCount },
    { id: 'settings', label: 'Profile & Settings', icon: Settings },
  ];

  return (
    <>
      {/* Slide-over Mobile Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            onClick={onClose}
          />
          <div className="relative flex flex-col w-72 max-w-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shadow-2xl z-10">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xs">
                  JT
                </div>
                <span className="font-bold text-slate-900 dark:text-white">
                  JobTracker
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Add CTA */}
            <div className="p-3">
              <button
                onClick={() => {
                  onClose();
                  openAddModal();
                }}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-indigo-600 text-white text-xs font-medium cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Add Application</span>
              </button>
            </div>

            {/* Navigation List */}
            <div className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onNavigate(item.id);
                      onClose();
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium cursor-pointer ${
                      isActive
                        ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300 font-semibold'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge ? (
                      <span className="px-1.5 py-0.5 text-[10px] rounded-full bg-slate-200 dark:bg-slate-800">
                        {item.badge}
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>

            {/* Logout Footer */}
            <div className="p-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => {
                  onClose();
                  logout();
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-600 dark:text-rose-400 font-medium rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Persistent Bottom Bar for Mobile Devices */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around h-14 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs border-t border-slate-200 dark:border-slate-800 px-2">
        <button
          onClick={() => onNavigate('dashboard')}
          className={`flex flex-col items-center justify-center flex-1 py-1 ${
            currentView === 'dashboard'
              ? 'text-indigo-600 dark:text-indigo-400'
              : 'text-slate-400 dark:text-slate-500'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span className="text-[10px] mt-0.5">Overview</span>
        </button>

        <button
          onClick={() => onNavigate('applications')}
          className={`flex flex-col items-center justify-center flex-1 py-1 relative ${
            currentView === 'applications'
              ? 'text-indigo-600 dark:text-indigo-400'
              : 'text-slate-400 dark:text-slate-500'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span className="text-[10px] mt-0.5">Tracker</span>
          {applications.length > 0 && (
            <span className="absolute top-1 right-3.5 w-2 h-2 rounded-full bg-indigo-600" />
          )}
        </button>

        {/* Center action button */}
        <button
          onClick={openAddModal}
          className="flex items-center justify-center -mt-4 w-10 h-10 rounded-full bg-indigo-600 text-white shadow-lg focus:outline-none cursor-pointer"
          aria-label="Add application"
        >
          <PlusCircle className="w-5 h-5" />
        </button>

        <button
          onClick={() => onNavigate('calendar')}
          className={`flex flex-col items-center justify-center flex-1 py-1 ${
            currentView === 'calendar'
              ? 'text-indigo-600 dark:text-indigo-400'
              : 'text-slate-400 dark:text-slate-500'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span className="text-[10px] mt-0.5">Schedule</span>
        </button>

        <button
          onClick={() => onNavigate('settings')}
          className={`flex flex-col items-center justify-center flex-1 py-1 ${
            currentView === 'settings' || currentView === 'profile'
              ? 'text-indigo-600 dark:text-indigo-400'
              : 'text-slate-400 dark:text-slate-500'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span className="text-[10px] mt-0.5">Settings</span>
        </button>
      </nav>
    </>
  );
};
