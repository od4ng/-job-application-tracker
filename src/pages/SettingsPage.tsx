import React, { useState, useEffect } from 'react';
import {
  User as UserIcon,
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
  FileText,
  Eye,
  EyeOff,
  UploadCloud,
  Moon,
  Sun,
  RotateCcw,
  Save,
  Lock,
  KeyRound,
  ShieldCheck,
  Check,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNotifications } from '../context/NotificationContext';
import { Button } from '../components/common/Button';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { storage } from '../services/storage';
import { User } from '../types';
import { ResumeDetailsModal } from '../components/profile/ResumeDetailsModal';
import { ResumeUploadModal } from '../components/profile/ResumeUploadModal';

export const SettingsPage: React.FC = () => {
  const { user, updateProfile, changePassword } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { addToast } = useNotifications();

  // Modals state
  const [isResumeDetailsOpen, setIsResumeDetailsOpen] = useState(false);
  const [isResumeUploadOpen, setIsResumeUploadOpen] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  // Profile Form state
  const [formData, setFormData] = useState({
    name: user?.name || '',
    username: user?.username || '',
    email: user?.email || '',
    phone: user?.phone || '',
    location: user?.location || '',
    preferredRole: user?.preferredRole || '',
    githubUrl: user?.githubUrl || '',
    linkedinUrl: user?.linkedinUrl || '',
    school: user?.school || '',
    course: user?.course || '',
    graduationYear: String(user?.graduationYear || ''),
    bio: user?.bio || '',
  });

  // Change Password state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        username: user.username || '',
        email: user.email || '',
        phone: user.phone || '',
        location: user.location || '',
        preferredRole: user.preferredRole || '',
        githubUrl: user.githubUrl || '',
        linkedinUrl: user.linkedinUrl || '',
        school: user.school || '',
        course: user.course || '',
        graduationYear: String(user.graduationYear || ''),
        bio: user.bio || '',
      });
    }
  }, [user]);

  if (!user) return null;

  const handleProfileChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: formData.name,
      phone: formData.phone,
      location: formData.location,
      preferredRole: formData.preferredRole,
      githubUrl: formData.githubUrl,
      linkedinUrl: formData.linkedinUrl,
      school: formData.school,
      course: formData.course,
      graduationYear: formData.graduationYear,
      bio: formData.bio,
    });
    addToast('Profile details updated successfully!', 'success');
  };

  const handleApplyExtractedProfile = (extracted: Partial<User>) => {
    updateProfile(extracted);
    addToast('Resume extracted and applied to your profile!', 'success');
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
    setPasswordError(null);
    setPasswordSuccess(false);
  };

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(false);

    if (!passwordData.currentPassword.trim()) {
      setPasswordError('Please enter your current password.');
      return;
    }

    if (!passwordData.newPassword) {
      setPasswordError('Please enter a new password.');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long.');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match. Please re-check.');
      return;
    }

    setIsSubmittingPassword(true);

    const res = changePassword(passwordData.currentPassword, passwordData.newPassword);
    setIsSubmittingPassword(false);

    if (res.success) {
      setPasswordSuccess(true);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      addToast('Password changed successfully!', 'success');
    } else {
      setPasswordError(res.error || 'Failed to update password.');
      addToast(res.error || 'Failed to update password', 'error');
    }
  };

  const handleResetDatabase = () => {
    storage.clearAll();
    window.location.reload();
  };

  const skillsCount =
    user.skillCategories?.reduce((acc, cat) => acc + cat.skills.length, 0) ||
    user.skills?.length ||
    0;
  const experienceCount = user.experiences?.length || 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Page Header with Default Profile Avatar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-200 dark:border-indigo-800/80 shadow-2xs shrink-0">
            <UserIcon className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              {user.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              @{user.username} • {user.email}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsResumeDetailsOpen(true)}
            icon={<FileText className="w-3.5 h-3.5" />}
          >
            View CV
          </Button>
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            title="Toggle theme"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-500" />}
          </button>
        </div>
      </div>

      {/* 1. Resume / CV Dedicated Card */}
      <div className="p-6 bg-gradient-to-br from-indigo-50/80 via-white to-indigo-50/40 dark:from-slate-900 dark:via-indigo-950/20 dark:to-slate-900 rounded-2xl border border-indigo-200 dark:border-indigo-800/60 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-3 rounded-xl bg-indigo-600 text-white shadow-xs shrink-0">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 text-[11px] font-bold mb-1">
                <Sparkles className="w-3 h-3" />
                <span>Resume & Credentials</span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                {user.name}'s Resume Details
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed max-w-xl">
                View your complete candidate profile, skills, experience, and education in a clean modal view or upload a new CV to auto-fill.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="primary"
              size="md"
              onClick={() => setIsResumeDetailsOpen(true)}
              className="shadow-xs font-semibold cursor-pointer"
              icon={<Eye className="w-4 h-4" />}
            >
              View Resume / CV
            </Button>
            <Button
              variant="outline"
              size="md"
              onClick={() => setIsResumeUploadOpen(true)}
              className="text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              icon={<UploadCloud className="w-4 h-4" />}
            >
              Upload / Auto-Fill
            </Button>
          </div>
        </div>

        {/* Resume Quick Snapshot Tags */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-indigo-100 dark:border-slate-800/80 text-xs">
          <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold uppercase">Target Role</span>
            <div className="font-bold text-slate-800 dark:text-slate-200 truncate mt-0.5">
              {user.preferredRole || 'Not specified'}
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold uppercase">Skills</span>
            <div className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">
              {skillsCount} Skills Listed
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold uppercase">Experience</span>
            <div className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">
              {experienceCount} Positions / Internships
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold uppercase">Education</span>
            <div className="font-bold text-slate-800 dark:text-slate-200 truncate mt-0.5">
              {user.school || 'Not specified'}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Candidate & Account Information Form */}
      <form
        onSubmit={handleSaveProfile}
        className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-5"
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <UserIcon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Personal & Contact Info</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Your primary details used for applications and job search tracking
            </p>
          </div>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            icon={<Save className="w-3.5 h-3.5" />}
          >
            Save Info
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleProfileChange}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="e.g. Jordan Jade Pondario"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Target Job Title / Headline
            </label>
            <input
              type="text"
              name="preferredRole"
              value={formData.preferredRole}
              onChange={handleProfileChange}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="e.g. Entry-Level IT / Junior Web Developer"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              disabled
              value={formData.email}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/20 text-xs text-slate-500 dark:text-slate-400 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Phone Number
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleProfileChange}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="e.g. 09074394731"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleProfileChange}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="e.g. Manila, Philippines"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              School / College
            </label>
            <input
              type="text"
              name="school"
              value={formData.school}
              onChange={handleProfileChange}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="e.g. Systems Plus Computer College"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              GitHub Profile Link
            </label>
            <input
              type="url"
              name="githubUrl"
              value={formData.githubUrl}
              onChange={handleProfileChange}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="https://github.com/..."
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              LinkedIn Profile Link
            </label>
            <input
              type="url"
              name="linkedinUrl"
              value={formData.linkedinUrl}
              onChange={handleProfileChange}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="https://linkedin.com/in/..."
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Short Bio / Summary
          </label>
          <textarea
            name="bio"
            rows={3}
            value={formData.bio}
            onChange={handleProfileChange}
            className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            placeholder="Write a brief professional summary..."
          />
        </div>
      </form>

      {/* 3. Change Password Section */}
      <form
        onSubmit={handleSavePassword}
        className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-5"
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Change Password</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Update your account password to keep your job search dashboard secure
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-medium text-slate-600 dark:text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Account Protected</span>
          </div>
        </div>

        {passwordError && (
          <div className="p-3.5 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 rounded-xl flex items-center gap-2.5 text-xs text-rose-800 dark:text-rose-300 animate-in fade-in duration-150">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400" />
            <span>{passwordError}</span>
          </div>
        )}

        {passwordSuccess && (
          <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 rounded-xl flex items-center gap-2.5 text-xs text-emerald-800 dark:text-emerald-300 animate-in fade-in duration-150">
            <Check className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <span>Your password has been changed successfully!</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Current Password */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                placeholder="••••••••"
                className="w-full pl-3 pr-9 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5"
                tabIndex={-1}
                aria-label={showCurrentPassword ? 'Hide password' : 'Show password'}
              >
                {showCurrentPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              New Password
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? 'text' : 'password'}
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                placeholder="Min 6 characters"
                className="w-full pl-3 pr-9 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5"
                tabIndex={-1}
                aria-label={showNewPassword ? 'Hide password' : 'Show password'}
              >
                {showNewPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Confirm New Password */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                placeholder="Re-type new password"
                className="w-full pl-3 pr-9 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5"
                tabIndex={-1}
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Use at least 6 characters. Make sure your new password is secure and memorable.
          </p>

          <Button
            type="submit"
            variant="primary"
            size="sm"
            isLoading={isSubmittingPassword}
            icon={<Lock className="w-3.5 h-3.5" />}
          >
            Update Password
          </Button>
        </div>
      </form>

      {/* 4. Appearance & Theme Settings */}
      <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            {theme === 'dark' ? <Moon className="w-4 h-4 text-indigo-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
            <span>Appearance Theme</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Switch between light and dark modes
          </p>
        </div>

        <button
          type="button"
          onClick={toggleTheme}
          className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center gap-2 text-xs font-semibold cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
        >
          {theme === 'dark' ? (
            <>
              <Sun className="w-4 h-4 text-amber-400" />
              <span>Light Mode</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 text-indigo-500" />
              <span>Dark Mode</span>
            </>
          )}
        </button>
      </div>

      {/* 5. Danger Zone: Clear Data */}
      <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-rose-200 dark:border-rose-950/60 shadow-xs space-y-3">
        <h3 className="text-sm font-bold text-rose-600 dark:text-rose-400">
          Clear All Application Data
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Clear all your stored job applications, timeline events, and notifications to start with an empty slate.
        </p>
        <Button
          variant="danger"
          size="sm"
          onClick={() => setIsResetConfirmOpen(true)}
          icon={<RotateCcw className="w-3.5 h-3.5" />}
        >
          Clear All Applications
        </Button>
      </div>

      {/* Resume Details Modal */}
      <ResumeDetailsModal
        isOpen={isResumeDetailsOpen}
        onClose={() => setIsResumeDetailsOpen(false)}
        user={user}
        onUpdateUser={updateProfile}
        onOpenUploadModal={() => setIsResumeUploadOpen(true)}
      />

      {/* Resume Upload / AI Parse Modal */}
      <ResumeUploadModal
        isOpen={isResumeUploadOpen}
        onClose={() => setIsResumeUploadOpen(false)}
        onApplyProfile={handleApplyExtractedProfile}
      />

      {/* Confirmation Dialog for Resetting Data */}
      <ConfirmDialog
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        onConfirm={handleResetDatabase}
        title="Clear All Stored Data"
        message="This will remove all job applications, timeline entries, and notifications from your browser storage. Are you sure?"
        confirmText="Yes, Clear Everything"
        variant="danger"
      />
    </div>
  );
};
