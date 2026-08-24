import React from 'react';
import {
  Sparkles,
  Calendar,
  BarChart3,
  ArrowRight,
  Briefcase,
  Layers,
  FileSpreadsheet,
  UploadCloud,
  Check,
  DollarSign,
  Sun,
  Moon,
  Lock,
} from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '../components/common/Button';
import { useTheme } from '../context/ThemeContext';
import { APPLICATION_STATUSES, STATUS_CONFIG } from '../utils/constants';

interface LandingPageProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onLogin }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white transition-colors duration-200 overflow-x-hidden">
      {/* Top Navbar */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 sm:px-8 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors"
      >
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ rotate: 15, scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-sm cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
          </motion.div>
          <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 dark:text-white">
            JobTracker
          </span>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <motion.button
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.08 }}
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Toggle theme"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-600" />
            )}
          </motion.button>

          <Button
            variant="ghost"
            size="sm"
            onClick={onLogin}
            className="text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-xs font-medium transition-all hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Sign In
          </Button>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Button
              variant="primary"
              size="sm"
              onClick={onGetStarted}
              className="text-xs font-medium shadow-xs"
            >
              Get Started
            </Button>
          </motion.div>
        </div>
      </motion.header>

      {/* Main Body */}
      <main className="flex-1 flex flex-col">
        {/* Hero Section */}
        <section className="relative px-4 pt-12 sm:pt-20 pb-12 max-w-5xl mx-auto text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold shadow-xs hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Built for everyone applying for jobs</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-tight max-w-4xl mx-auto"
          >
            Never lose track of where you applied{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-cyan-500 to-emerald-500 dark:from-indigo-400 dark:via-cyan-300 dark:to-emerald-400">
              or what happens next.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-sm sm:text-base lg:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed"
          >
            A simple tracker to keep your company list, interview dates, follow-up reminders, and salary offers organized in one place.
          </motion.p>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center pt-2 max-w-md mx-auto"
          >
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
              <Button
                variant="primary"
                size="lg"
                onClick={onGetStarted}
                className="w-full sm:w-auto shadow-sm cursor-pointer font-bold group"
                icon={<ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />}
              >
                Get Started Free
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                onClick={onLogin}
                className="w-full sm:w-auto text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                Sign In
              </Button>
            </motion.div>
          </motion.div>

          {/* Value Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="pt-4 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-slate-500 dark:text-slate-400"
          >
            <div className="flex items-center gap-1.5 hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
              <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Saves directly in your browser</span>
            </div>
            <div className="flex items-center gap-1.5 hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
              <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Works for any industry or role</span>
            </div>
            <div className="flex items-center gap-1.5 hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
              <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Export to Excel CSV or JSON backup</span>
            </div>
          </motion.div>
        </section>

        {/* 10-Stage Pipeline Overview */}
        <section className="px-4 py-8 sm:py-12 max-w-6xl mx-auto w-full space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-2 max-w-2xl mx-auto"
          >
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Track each application step-by-step
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              From finding a job post to signing your contract, always know your current status.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 sm:p-7 space-y-6"
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {APPLICATION_STATUSES.map((status, index) => {
                const config = STATUS_CONFIG[status];
                return (
                  <motion.div
                    key={status}
                    whileHover={{ y: -3, scale: 1.02 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-default ${config.bgLight} ${config.textLight} ${config.borderLight} ${config.bgDark} ${config.textDark} ${config.borderDark}`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-[10px] font-bold opacity-70">
                        Stage {index + 1}
                      </span>
                      <span className={`w-2 h-2 rounded-full ${config.dotColor}`} />
                    </div>
                    <div className="text-xs sm:text-sm font-bold truncate">
                      {status}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800/80">
              <motion.div
                whileHover={{ y: -2 }}
                className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-transparent hover:border-slate-200 dark:hover:border-slate-700/60 transition-all"
              >
                <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 shrink-0">
                  <Briefcase className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white">Bookmarks & Submissions</h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Save jobs you spot online and note down the date you sent your resume.
                  </p>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ y: -2 }}
                className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-transparent hover:border-slate-200 dark:hover:border-slate-700/60 transition-all"
              >
                <div className="p-2 rounded-lg bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 shrink-0">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white">Interviews & Tests</h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Schedule HR phone screens, written exams, and hiring manager interviews.
                  </p>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ y: -2 }}
                className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-transparent hover:border-slate-200 dark:hover:border-slate-700/60 transition-all"
              >
                <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 shrink-0">
                  <DollarSign className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white">Offers & Decisions</h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Compare salary offers, allowances, work setups (remote or on-site), and benefits.
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Feature Grid */}
        <section className="px-4 py-12 sm:py-16 max-w-6xl mx-auto w-full space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-2 max-w-2xl mx-auto"
          >
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Tools to keep your job hunt simple
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Clear, practical features designed to keep you organized without extra effort.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                icon: Layers,
                colorClasses: 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400',
                hoverBorder: 'hover:border-indigo-300 dark:hover:border-indigo-700',
                title: 'Board, Table & List Views',
                desc: 'Drag cards across stages like a kanban board, or use a spreadsheet table with quick search and sorting.',
              },
              {
                icon: Calendar,
                colorClasses: 'bg-cyan-50 dark:bg-cyan-950/60 border-cyan-200 dark:border-cyan-800 text-cyan-600 dark:text-cyan-400',
                hoverBorder: 'hover:border-cyan-300 dark:hover:border-cyan-700',
                title: 'Interview Calendar',
                desc: 'Keep track of interview times, test deadlines, and reminders on a calendar so you never miss an appointment.',
              },
              {
                icon: UploadCloud,
                colorClasses: 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400',
                hoverBorder: 'hover:border-emerald-300 dark:hover:border-emerald-700',
                title: 'Profile & Resume Details',
                desc: 'Store your contact info, skills, and past experience for easy reference whenever you fill out application forms.',
              },
              {
                icon: DollarSign,
                colorClasses: 'bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800 text-amber-600 dark:text-amber-400',
                hoverBorder: 'hover:border-amber-300 dark:hover:border-amber-700',
                title: 'Salary & Offer Comparison',
                desc: 'Note down base pay, bonus details, health insurance, and setup type to easily compare company offers side-by-side.',
              },
              {
                icon: BarChart3,
                colorClasses: 'bg-purple-50 dark:bg-purple-950/60 border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-400',
                hoverBorder: 'hover:border-purple-300 dark:hover:border-purple-700',
                title: 'Application Numbers',
                desc: 'See how many places you have applied to, how many scheduled interviews you have, and which ones are pending.',
              },
              {
                icon: FileSpreadsheet,
                colorClasses: 'bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400',
                hoverBorder: 'hover:border-blue-300 dark:hover:border-blue-700',
                title: 'Download & Export',
                desc: 'Save your entire list to a CSV spreadsheet or JSON backup anytime for safe offline keeping.',
              },
            ].map((card, idx) => {
              const IconComp = card.icon;
              return (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.4, delay: idx * 0.07 }}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className={`p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs ${card.hoverBorder} transition-all duration-200 space-y-3 group`}
                >
                  <div className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-transform group-hover:scale-110 duration-200 ${card.colorClasses}`}>
                    <IconComp className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {card.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* How It Works Section */}
        <section className="px-4 py-12 max-w-6xl mx-auto w-full space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-2"
          >
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              How it works
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Three simple steps to stay on top of your job applications.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                num: 1,
                title: 'Set up your profile',
                desc: 'Add your target job title, skills, and background so you have quick answers ready whenever a recruiter calls.',
              },
              {
                num: 2,
                title: 'Add companies and interview dates',
                desc: 'Log every job you apply for, write down interview dates, and keep track of who you spoke with.',
              },
              {
                num: 3,
                title: 'Update your status and pick an offer',
                desc: 'Move applications through each round and review salary details to decide where to work.',
              },
            ].map((step, idx) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                whileHover={{ y: -3 }}
                className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-3 hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-200"
              >
                <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold text-sm flex items-center justify-center shadow-xs">
                  {step.num}
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {step.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Privacy & Security Section */}
        <section className="px-4 py-12 max-w-6xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5 }}
            className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
          >
            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
                <Lock className="w-3.5 h-3.5" />
                <span>Private & stored in your browser</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                Your data stays with you
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                All your company notes, salary records, and interview schedules are stored on your device. You can download a backup copy anytime.
              </p>
            </div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="shrink-0">
              <Button
                variant="primary"
                size="md"
                onClick={onGetStarted}
                className="shadow-xs cursor-pointer group"
                icon={<ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />}
              >
                Open Tracker
              </Button>
            </motion.div>
          </motion.div>
        </section>

        {/* Bottom CTA Banner */}
        <section className="px-4 py-12 max-w-4xl mx-auto text-center w-full">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5 }}
            className="p-8 sm:p-10 rounded-3xl bg-gradient-to-tr from-indigo-50 via-white to-indigo-50/50 dark:from-slate-900 dark:via-indigo-950/40 dark:to-slate-900 border border-indigo-200 dark:border-indigo-800 shadow-sm space-y-5"
          >
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Ready to organize your job applications?
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
              Keep your companies, interview dates, and offers straight without messy notes.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-2">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="w-full sm:w-auto">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={onGetStarted}
                  className="w-full sm:w-auto font-bold shadow-xs cursor-pointer group"
                  icon={<ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />}
                >
                  Get Started Free
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={onLogin}
                  className="w-full sm:w-auto border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 cursor-pointer"
                >
                  Sign In
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-indigo-600 flex items-center justify-center text-white text-[10px] font-bold">
              JT
            </div>
            <span className="font-semibold text-slate-700 dark:text-slate-300">JobTracker</span>
            <span>• Job Application & Interview Organizer</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Stored in your browser • Export to CSV or JSON anytime
          </p>
        </div>
      </footer>
    </div>
  );
};
