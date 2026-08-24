import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider, useNotifications } from './context/NotificationContext';
import { ApplicationProvider } from './context/ApplicationContext';
import { AppLayout } from './components/layout/AppLayout';
import { ToastContainer } from './components/common/Toast';
import { ApplicationDrawer } from './components/applications/ApplicationDrawer';
import { ApplicationFormModal } from './components/applications/ApplicationFormModal';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { DashboardPage } from './pages/DashboardPage';
import { ApplicationsPage } from './pages/ApplicationsPage';
import { CalendarPage } from './pages/CalendarPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { ProfilePage } from './pages/ProfilePage';
import { NotificationsPage } from './pages/NotificationsPage';
import { SettingsPage } from './pages/SettingsPage';

function MainApp() {
  const { isAuthenticated, isLoading } = useAuth();
  const { toasts, removeToast } = useNotifications();
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [publicView, setPublicView] = useState<'landing' | 'login' | 'register' | 'forgot_password'>('landing');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-slate-400 font-medium">Initializing JobTracker...</p>
        </div>
      </div>
    );
  }

  // If user is not logged in, show auth / landing flows
  if (!isAuthenticated) {
    if (publicView === 'landing') {
      return (
        <LandingPage
          onGetStarted={() => setPublicView('register')}
          onLogin={() => setPublicView('login')}
        />
      );
    }
    if (publicView === 'login') {
      return (
        <LoginPage
          onNavigateHome={() => setPublicView('landing')}
          onNavigateRegister={() => setPublicView('register')}
          onNavigateForgotPassword={() => setPublicView('forgot_password')}
          onLoginSuccess={() => setCurrentView('dashboard')}
        />
      );
    }
    if (publicView === 'register') {
      return (
        <RegisterPage
          onNavigateHome={() => setPublicView('landing')}
          onNavigateLogin={() => setPublicView('login')}
          onRegisterSuccess={() => setCurrentView('dashboard')}
        />
      );
    }
    if (publicView === 'forgot_password') {
      return (
        <ForgotPasswordPage
          onNavigateHome={() => setPublicView('landing')}
          onNavigateLogin={() => setPublicView('login')}
        />
      );
    }
  }

  // Render Authenticated View
  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardPage onNavigate={setCurrentView} />;
      case 'applications':
        return <ApplicationsPage />;
      case 'calendar':
        return <CalendarPage />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'profile':
        return <ProfilePage />;
      case 'notifications':
        return <NotificationsPage onNavigate={setCurrentView} />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardPage onNavigate={setCurrentView} />;
    }
  };

  return (
    <AppLayout currentView={currentView} onNavigate={setCurrentView}>
      {renderCurrentView()}

      {/* Global Application Slide-over Drawer & Form Modal */}
      <ApplicationDrawer onNavigate={setCurrentView} />
      <ApplicationFormModal />

      {/* Global Toast Notifications */}
      <ToastContainer />
    </AppLayout>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <ApplicationProvider>
            <MainApp />
          </ApplicationProvider>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
