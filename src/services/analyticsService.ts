import { JobApplication, DynamicInsight } from '../types';

export interface SourceEffectiveness {
  source: string;
  total: number;
  interviews: number;
  interviewRate: number;
  offers: number;
}

export interface AnalyticsSummary {
  total: number;
  activeApplications: number;
  activeCount: number;
  byStatus: Record<string, number>;
  interviewCount: number;
  assessmentCount: number;
  offerCount: number;
  hiredCount: number;
  rejectedCount: number;
  withdrawnCount: number;
  interviewRate: number;
  offerRate: number;
  responseRate: number;
  rejectionRate: number;
  applicationsThisMonth: number;
  byWorkSetup: Record<string, number>;
  bySource: Record<string, number>;
  monthlyVelocity: { month: string; count: number }[];
  byMonth: { month: string; count: number }[];
  sourceEffectiveness: SourceEffectiveness[];
  insights: DynamicInsight[];
}

export class AnalyticsService {
  public calculateAnalytics(applications: JobApplication[]): AnalyticsSummary {
    const total = applications.length;

    const byStatus: Record<string, number> = {
      Saved: 0,
      Applied: 0,
      Screening: 0,
      Interview: 0,
      Assessment: 0,
      'Final Interview': 0,
      Offer: 0,
      Hired: 0,
      Rejected: 0,
      Withdrawn: 0,
    };

    const byWorkSetup: Record<string, number> = {
      Remote: 0,
      Hybrid: 0,
      'On-site': 0,
      Unspecified: 0,
    };

    const bySource: Record<string, number> = {};
    const sourceInterviews: Record<string, number> = {};
    const sourceOffers: Record<string, number> = {};
    const monthCounts: Record<string, number> = {};
    const roleCounts: Record<string, number> = {};

    let interviewCount = 0;
    let assessmentCount = 0;
    let offerCount = 0;
    let hiredCount = 0;
    let rejectedCount = 0;
    let withdrawnCount = 0;
    let activeCount = 0;
    let respondedCount = 0;

    const now = new Date();
    const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    let currentMonthApps = 0;

    applications.forEach((app) => {
      // Status counting
      if (byStatus[app.status] !== undefined) {
        byStatus[app.status]++;
      } else {
        byStatus[app.status] = 1;
      }

      const isInterview = app.status === 'Interview' || app.status === 'Final Interview';
      const isOffer = app.status === 'Offer' || app.status === 'Hired';

      if (isInterview) {
        interviewCount++;
      }
      if (app.status === 'Assessment') {
        assessmentCount++;
      }
      if (app.status === 'Offer') {
        offerCount++;
      }
      if (app.status === 'Hired') {
        hiredCount++;
      }
      if (app.status === 'Rejected') {
        rejectedCount++;
      }
      if (app.status === 'Withdrawn') {
        withdrawnCount++;
      }

      // Active applications
      if (app.status !== 'Rejected' && app.status !== 'Withdrawn' && app.status !== 'Hired') {
        activeCount++;
      }

      // Response determination
      if (
        app.status === 'Screening' ||
        app.status === 'Interview' ||
        app.status === 'Assessment' ||
        app.status === 'Final Interview' ||
        app.status === 'Offer' ||
        app.status === 'Hired'
      ) {
        respondedCount++;
      }

      // Work Setup
      const ws = app.workSetup || 'Unspecified';
      byWorkSetup[ws] = (byWorkSetup[ws] || 0) + 1;

      // Source
      const src = app.applicationSource || 'Other';
      bySource[src] = (bySource[src] || 0) + 1;
      if (isInterview) {
        sourceInterviews[src] = (sourceInterviews[src] || 0) + 1;
      }
      if (isOffer) {
        sourceOffers[src] = (sourceOffers[src] || 0) + 1;
      }

      // Roles for insight
      if (app.position) {
        const cleanRole = app.position.trim();
        roleCounts[cleanRole] = (roleCounts[cleanRole] || 0) + 1;
      }

      // Monthly velocity
      if (app.dateApplied) {
        const date = new Date(app.dateApplied);
        if (!isNaN(date.getTime())) {
          const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          monthCounts[monthKey] = (monthCounts[monthKey] || 0) + 1;

          if (monthKey === currentMonthKey) {
            currentMonthApps++;
          }
        }
      }
    });

    const interviewRate = total > 0 ? Math.round((interviewCount / total) * 100) : 0;
    const offerRate = total > 0 ? Math.round(((offerCount + hiredCount) / total) * 100) : 0;
    const responseRate = total > 0 ? Math.round((respondedCount / total) * 100) : 0;
    const rejectionRate = total > 0 ? Math.round((rejectedCount / total) * 100) : 0;

    // Monthly velocity series
    const monthlyVelocity = Object.entries(monthCounts)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([m, c]) => {
        const [year, month] = m.split('-');
        const date = new Date(parseInt(year), parseInt(month) - 1, 1);
        const monthLabel = date.toLocaleString('default', { month: 'short', year: 'numeric' });
        return { month: monthLabel, count: c };
      });

    // Source effectiveness matrix
    const sourceEffectiveness: SourceEffectiveness[] = Object.entries(bySource).map(([src, count]) => {
      const ints = sourceInterviews[src] || 0;
      const offs = sourceOffers[src] || 0;
      return {
        source: src,
        total: count,
        interviews: ints,
        interviewRate: count > 0 ? Math.round((ints / count) * 100) : 0,
        offers: offs,
      };
    }).sort((a, b) => b.total - a.total);

    // Dynamic Insights Generator
    const insights: DynamicInsight[] = [];

    if (total > 0) {
      // 1. Monthly count
      insights.push({
        id: 'ins-pace',
        category: 'pace',
        title: 'Monthly Applications',
        description: `You've sent ${currentMonthApps} application${currentMonthApps === 1 ? '' : 's'} so far this month.`,
        metricValue: `${currentMonthApps} this month`,
      });

      // 2. Interview Rate
      insights.push({
        id: 'ins-interview-rate',
        category: 'rate',
        title: 'Interview Rate',
        description: `${interviewRate}% of your applications have led to an interview or screening.`,
        metricValue: `${interviewRate}%`,
      });

      // 3. Response Rate
      insights.push({
        id: 'ins-response-rate',
        category: 'rate',
        title: 'Employer Responses',
        description: `${responseRate}% of companies responded with a screening, test, or interview.`,
        metricValue: `${responseRate}%`,
      });

      // 4. Most Common Role
      const sortedRoles = Object.entries(roleCounts).sort((a, b) => b[1] - a[1]);
      if (sortedRoles.length > 0) {
        const topRole = sortedRoles[0];
        insights.push({
          id: 'ins-role',
          category: 'role',
          title: 'Top Applied Role',
          description: `Most of your applications (${topRole[1]}) are for "${topRole[0]}".`,
          metricValue: topRole[0],
        });
      }

      // 5. Most Productive Source
      if (sourceEffectiveness.length > 0) {
        const topSource = sourceEffectiveness[0];
        const srcPct = Math.round((topSource.total / total) * 100);
        insights.push({
          id: 'ins-source',
          category: 'source',
          title: 'Main Job Board',
          description: `You find most of your leads on ${topSource.source} (${srcPct}% of total applications).`,
          metricValue: `${topSource.source} (${srcPct}%)`,
        });
      }
    }

    return {
      total,
      activeApplications: activeCount,
      activeCount,
      byStatus,
      interviewCount,
      assessmentCount,
      offerCount,
      hiredCount,
      rejectedCount,
      withdrawnCount,
      interviewRate,
      offerRate,
      responseRate,
      rejectionRate,
      applicationsThisMonth: currentMonthApps,
      byWorkSetup,
      bySource,
      monthlyVelocity,
      byMonth: monthlyVelocity,
      sourceEffectiveness,
      insights,
    };
  }
}

export const analyticsService = new AnalyticsService();
