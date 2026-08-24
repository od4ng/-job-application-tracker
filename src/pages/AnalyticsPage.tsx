import React from 'react';
import {
  Briefcase,
  Globe,
  TrendingUp,
  Award,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowRight,
  Sparkles,
  BarChart3,
} from 'lucide-react';
import { useApplications } from '../context/ApplicationContext';
import { StatusChart } from '../components/dashboard/StatusChart';
import { DynamicInsightsBanner } from '../components/dashboard/DynamicInsightsBanner';

export const AnalyticsPage: React.FC = () => {
  const { applications, analytics, insights } = useApplications();

  const funnelSteps = [
    { label: 'Total Applied', count: analytics.total, color: 'bg-blue-500' },
    { label: 'Screenings', count: (analytics.byStatus['Screening'] || 0) + analytics.interviewCount + analytics.offerCount + analytics.hiredCount, color: 'bg-cyan-500' },
    { label: 'Assessments', count: (analytics.byStatus['Assessment'] || 0), color: 'bg-purple-500' },
    { label: 'Interviews', count: analytics.interviewCount, color: 'bg-indigo-500' },
    { label: 'Final Rounds', count: (analytics.byStatus['Final Interview'] || 0) + analytics.offerCount + analytics.hiredCount, color: 'bg-violet-500' },
    { label: 'Offers & Hired', count: analytics.offerCount + analytics.hiredCount, color: 'bg-emerald-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Application Stats
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            See where your applications stand and track your interview progress
          </p>
        </div>
      </div>

      {/* Dynamic Insights */}
      {insights.length > 0 && <DynamicInsightsBanner insights={insights} />}

      {/* Core Key Conversion Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Total Applied</div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            {analytics.total}
          </div>
          <div className="text-xs text-slate-400 mt-0.5">
            {analytics.activeApplications} in progress
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Interview Rate</div>
          <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">
            {analytics.interviewRate}%
          </div>
          <div className="text-xs text-slate-400 mt-0.5">
            {analytics.interviewCount} interviews & screenings
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Offer Rate</div>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            {analytics.offerRate}%
          </div>
          <div className="text-xs text-slate-400 mt-0.5">
            {analytics.offerCount + analytics.hiredCount} offers / hires
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">This Month</div>
          <div className="text-2xl font-bold text-cyan-600 dark:text-cyan-400 mt-1">
            {analytics.applicationsThisMonth}
          </div>
          <div className="text-xs text-slate-400 mt-0.5">Applications sent</div>
        </div>
      </div>

      {/* Application Funnel Flow */}
      <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Hiring Funnel</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              How your applications progress through each stage
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
          {funnelSteps.map((step, idx) => {
            const conversionPct = analytics.total > 0 ? Math.round((step.count / analytics.total) * 100) : 0;
            return (
              <div
                key={step.label}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-1 relative"
              >
                <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 truncate">
                  {step.label}
                </div>
                <div className="text-lg font-bold text-slate-900 dark:text-white">
                  {step.count}
                </div>
                <div className="flex items-center gap-1 text-[11px] font-medium text-slate-500">
                  <div className={`w-2 h-2 rounded-full ${step.color}`} />
                  <span>{conversionPct}% of total</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Status Distribution Breakdown */}
      <div>
        <StatusChart statusCounts={analytics.byStatus} total={analytics.total} />
      </div>

      {/* Monthly Velocity & Source Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Activity Velocity */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <BarChart3 className="w-4 h-4 text-indigo-500" />
            <span>Applications by Month</span>
          </h3>

          <div className="space-y-3">
            {analytics.monthlyVelocity.map((month) => {
              const maxMonthly = Math.max(...analytics.monthlyVelocity.map((m) => m.count), 1);
              const barWidth = Math.round((month.count / maxMonthly) * 100);

              return (
                <div key={month.month} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {month.month}
                    </span>
                    <span className="text-slate-900 dark:text-white font-bold">
                      {month.count} {month.count === 1 ? 'application' : 'applications'}
                    </span>
                  </div>
                  <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${barWidth}%` }}
                      className="h-full bg-indigo-600 dark:bg-indigo-500 rounded-full transition-all duration-300"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Source Effectiveness Matrix */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <Globe className="w-4 h-4 text-cyan-500" />
            <span>Applications by Source</span>
          </h3>

          <div className="space-y-3">
            {analytics.sourceEffectiveness.map((src) => {
              const pct = analytics.total ? Math.round((src.total / analytics.total) * 100) : 0;
              return (
                <div key={src.source} className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800/80 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {src.source}
                    </span>
                    <span className="text-slate-500 dark:text-slate-400">
                      {src.total} apps ({pct}%)
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400">
                    <span className="text-indigo-600 dark:text-indigo-400 font-semibold">
                      {src.interviews} Interviews ({src.interviewRate}%)
                    </span>
                    <span>•</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                      {src.offers} Offers
                    </span>
                  </div>

                  <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${pct}%` }}
                      className="h-full bg-cyan-500 rounded-full transition-all duration-300"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
