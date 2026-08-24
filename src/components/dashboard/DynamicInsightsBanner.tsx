import React from 'react';
import {
  Sparkles,
  TrendingUp,
  Target,
  Globe,
  Clock,
  Compass,
  CheckCircle,
} from 'lucide-react';
import { DynamicInsight } from '../../types';

interface DynamicInsightsBannerProps {
  insights: DynamicInsight[];
}

export const DynamicInsightsBanner: React.FC<DynamicInsightsBannerProps> = ({ insights }) => {
  if (!insights || insights.length === 0) return null;

  const getIcon = (category: DynamicInsight['category']) => {
    switch (category) {
      case 'pace':
        return <Clock className="w-4 h-4 text-blue-500 shrink-0" />;
      case 'rate':
        return <TrendingUp className="w-4 h-4 text-emerald-500 shrink-0" />;
      case 'role':
        return <Target className="w-4 h-4 text-indigo-500 shrink-0" />;
      case 'source':
        return <Globe className="w-4 h-4 text-purple-500 shrink-0" />;
      default:
        return <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />;
    }
  };

  return (
    <div className="p-4 sm:p-5 bg-gradient-to-r from-indigo-50/70 via-slate-50 to-purple-50/40 dark:from-indigo-950/30 dark:via-slate-900 dark:to-purple-950/20 rounded-2xl border border-indigo-100/80 dark:border-indigo-900/40 shadow-xs space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-lg bg-indigo-600 text-white shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
            Search Highlights
          </h3>
        </div>
        <span className="text-[11px] font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-100/60 dark:bg-indigo-900/40 px-2 py-0.5 rounded-full">
          Summary
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {insights.slice(0, 3).map((item) => (
          <div
            key={item.id}
            className="p-3 bg-white dark:bg-slate-900/90 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-start gap-3 transition-all hover:border-indigo-300 dark:hover:border-indigo-700"
          >
            <div className="mt-0.5">{getIcon(item.category)}</div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-1 mb-0.5">
                <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {item.title}
                </span>
                {item.metricValue && (
                  <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 shrink-0">
                    {item.metricValue}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug line-clamp-2">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
