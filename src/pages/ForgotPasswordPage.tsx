import React, { useState } from 'react';
import { Sparkles, ArrowLeft, Mail, CheckCircle } from 'lucide-react';
import { Button } from '../components/common/Button';

interface ForgotPasswordPageProps {
  onNavigateHome: () => void;
  onNavigateLogin: () => void;
}

export const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({
  onNavigateHome,
  onNavigateLogin,
}) => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4">
      {/* Top Back to Homepage link */}
      <div className="w-full max-w-md mb-3 flex items-center justify-between">
        <button
          type="button"
          onClick={onNavigateHome}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-white transition-colors cursor-pointer py-1 px-2 rounded-lg hover:bg-slate-800/80"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Homepage</span>
        </button>
        <span className="text-[11px] text-slate-500">Account Recovery</span>
      </div>

      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white shadow-lg mb-2">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            Reset Password
          </h2>
          <p className="text-xs text-slate-400">
            Enter your registered email address to recover your account
          </p>
        </div>

        {isSubmitted ? (
          <div className="p-4 bg-emerald-950/40 border border-emerald-800 rounded-xl text-center space-y-3">
            <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto" />
            <h4 className="text-sm font-bold text-emerald-300">
              Reset Instructions Sent
            </h4>
            <p className="text-xs text-slate-300">
              If an account exists for <span className="font-semibold text-white">{email}</span>, we've sent password reset steps to your email.
            </p>
            <div className="flex flex-col gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onNavigateLogin}
                className="w-full text-white border-slate-700"
              >
                Back to Sign In
              </Button>
              <button
                type="button"
                onClick={onNavigateHome}
                className="text-xs text-slate-500 hover:text-slate-300 transition-colors py-1"
              >
                ← Back to Homepage
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Your Account Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. alex@example.com"
                  className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-slate-700 bg-slate-800 text-white"
                  required
                />
              </div>
            </div>

            <Button type="submit" variant="primary" size="md" className="w-full">
              Send Password Reset Link
            </Button>

            <div className="space-y-2 pt-2 text-center">
              <button
                type="button"
                onClick={onNavigateLogin}
                className="w-full flex items-center justify-center gap-1.5 text-xs text-slate-400 hover:text-white"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Sign In</span>
              </button>
              <button
                type="button"
                onClick={onNavigateHome}
                className="text-xs text-slate-500 hover:text-slate-300 transition-colors block mx-auto pt-1"
              >
                ← Back to Homepage
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
