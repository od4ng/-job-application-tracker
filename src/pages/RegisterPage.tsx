import React, { useState } from 'react';
import { Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/common/Button';

interface RegisterPageProps {
  onNavigateHome: () => void;
  onNavigateLogin: () => void;
  onRegisterSuccess: () => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({
  onNavigateHome,
  onNavigateLogin,
  onRegisterSuccess,
}) => {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    school: '',
    course: '',
    graduationYear: new Date().getFullYear(),
    preferredRole: '',
    password: '',
  });

  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim() || !formData.email.trim()) {
      setError('Please fill in your name and email address.');
      return;
    }

    const username = formData.username.trim() || formData.name.toLowerCase().replace(/\s+/g, '');

    const res = register({
      name: formData.name.trim(),
      username,
      email: formData.email.trim(),
      school: formData.school.trim() || 'University',
      course: formData.course.trim() || 'Degree / Major',
      graduationYear: Number(formData.graduationYear) || new Date().getFullYear(),
      preferredRole: formData.preferredRole.trim() || 'Job Seeker',
      skills: [],
      bio: formData.preferredRole ? `Candidate seeking ${formData.preferredRole} opportunities.` : 'Ready for new career opportunities.',
    });

    if (res.success) {
      onRegisterSuccess();
    } else {
      setError(res.error || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 selection:bg-indigo-500 selection:text-white py-12">
      {/* Top Back to Homepage link */}
      <div className="w-full max-w-lg mb-3 flex items-center justify-between">
        <button
          type="button"
          onClick={onNavigateHome}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-white transition-colors cursor-pointer py-1 px-2 rounded-lg hover:bg-slate-800/80"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Homepage</span>
        </button>
        <span className="text-[11px] text-slate-500">Create Account</span>
      </div>

      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white shadow-lg mb-2">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            Create Your Account
          </h2>
          <p className="text-xs text-slate-400">
            Set up your job application tracker and career dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-rose-950/60 border border-rose-800 text-rose-300 text-xs font-medium">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Alex Morgan"
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-700 bg-slate-800 text-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="e.g. alex_morgan"
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-700 bg-slate-800 text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Email Address <span className="text-rose-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="e.g. alex@example.com"
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-700 bg-slate-800 text-white"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                School / University
              </label>
              <input
                type="text"
                name="school"
                value={formData.school}
                onChange={handleChange}
                placeholder="e.g. State University"
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-700 bg-slate-800 text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Course / Major
              </label>
              <input
                type="text"
                name="course"
                value={formData.course}
                onChange={handleChange}
                placeholder="e.g. BS Computer Science"
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-700 bg-slate-800 text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Target / Preferred Role
              </label>
              <input
                type="text"
                name="preferredRole"
                value={formData.preferredRole}
                onChange={handleChange}
                placeholder="e.g. Frontend Developer"
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-700 bg-slate-800 text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Expected Grad Year
              </label>
              <input
                type="number"
                name="graduationYear"
                value={formData.graduationYear}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-700 bg-slate-800 text-white"
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="md"
            className="w-full mt-4"
            icon={<ArrowRight className="w-4 h-4" />}
          >
            Create Account & Enter
          </Button>
        </form>

        <div className="space-y-3 pt-2 border-t border-slate-800 text-center">
          <div className="text-xs text-slate-400">
            <span>Already have an account? </span>
            <button
              type="button"
              onClick={onNavigateLogin}
              className="text-indigo-400 font-semibold hover:underline"
            >
              Sign in
            </button>
          </div>
          <button
            type="button"
            onClick={onNavigateHome}
            className="text-xs text-slate-500 hover:text-slate-300 transition-colors block mx-auto"
          >
            ← Back to Homepage
          </button>
        </div>
      </div>
    </div>
  );
};
