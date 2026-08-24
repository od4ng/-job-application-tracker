import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { MobileNav } from './MobileNav';
import { ToastContainer } from '../common/Toast';
import { ApplicationFormModal } from '../applications/ApplicationFormModal';
import { ApplicationDrawer } from '../applications/ApplicationDrawer';

interface AppLayoutProps {
  currentView: string;
  onNavigate: (view: string) => void;
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  currentView,
  onNavigate,
  children,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getPageTitle = (view: string) => {
    switch (view) {
      case 'dashboard':
        return 'Dashboard';
      case 'applications':
        return 'Job Applications';
      case 'calendar':
        return 'Calendar & Reminders';
      case 'analytics':
        return 'Analytics & Insights';
      case 'notifications':
        return 'Notifications';
      case 'profile':
      case 'settings':
        return 'Profile & Settings';
      default:
        return 'JobTracker';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col lg:flex-row antialiased selection:bg-indigo-500 selection:text-white">
      {/* Desktop Sidebar */}
      <Sidebar currentView={currentView} onNavigate={onNavigate} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-16 lg:pb-0">
        <Navbar
          currentView={currentView}
          onNavigate={onNavigate}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          pageTitle={getPageTitle(currentView)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Mobile Nav & Drawer */}
      <MobileNav
        currentView={currentView}
        onNavigate={onNavigate}
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Global Modals & Detail Drawers */}
      <ApplicationFormModal />
      <ApplicationDrawer onNavigate={onNavigate} />

      {/* Feedback Toast Notification Container */}
      <ToastContainer />
    </div>
  );
};
