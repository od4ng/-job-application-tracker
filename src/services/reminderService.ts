import { JobApplication, ReminderItem, ReminderUrgency } from '../types';

export class ReminderService {
  public generateReminders(applications: JobApplication[]): {
    all: ReminderItem[];
    overdue: ReminderItem[];
    today: ReminderItem[];
    upcoming: ReminderItem[];
  } {
    const reminders: ReminderItem[] = [];
    const now = new Date();

    // Normalize today to midnight for diff calculations
    const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

    applications.forEach((app) => {
      // 1. Follow-up reminders (for active applications)
      if (app.followUpDate && app.status !== 'Rejected' && app.status !== 'Withdrawn' && app.status !== 'Hired') {
        const fDate = new Date(app.followUpDate);
        const fDateMidnight = new Date(fDate.getFullYear(), fDate.getMonth(), fDate.getDate()).getTime();
        const diffDays = Math.round((fDateMidnight - todayMidnight) / (1000 * 60 * 60 * 24));

        let urgency: ReminderUrgency = 'upcoming';
        let subtitle = `Due in ${diffDays} days`;

        if (diffDays < 0) {
          urgency = 'overdue';
          subtitle = `Overdue by ${Math.abs(diffDays)} day${Math.abs(diffDays) === 1 ? '' : 's'}`;
        } else if (diffDays === 0) {
          urgency = 'today';
          subtitle = 'Follow-up due today';
        } else if (diffDays === 1) {
          urgency = 'upcoming';
          subtitle = 'Due tomorrow';
        }

        reminders.push({
          id: `rem-f-${app.id}`,
          applicationId: app.id,
          application: app,
          companyName: app.companyName,
          position: app.position,
          type: 'followup',
          title: `Follow up with ${app.companyName}`,
          subtitle,
          date: app.followUpDate,
          urgency,
          daysDiff: diffDays,
        });
      }

      // 2. Interview reminders
      if (app.interviewDate) {
        const iDate = new Date(app.interviewDate);
        const iDateMidnight = new Date(iDate.getFullYear(), iDate.getMonth(), iDate.getDate()).getTime();
        const diffDays = Math.round((iDateMidnight - todayMidnight) / (1000 * 60 * 60 * 24));

        let urgency: ReminderUrgency = 'upcoming';
        let subtitle = `In ${diffDays} days (${iDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})`;

        if (diffDays < 0) {
          urgency = 'overdue';
          subtitle = `Past date (${iDate.toLocaleDateString()})`;
        } else if (diffDays === 0) {
          urgency = 'today';
          subtitle = `Today at ${iDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        } else if (diffDays === 1) {
          urgency = 'upcoming';
          subtitle = `Tomorrow at ${iDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        }

        reminders.push({
          id: `rem-i-${app.id}`,
          applicationId: app.id,
          application: app,
          companyName: app.companyName,
          position: app.position,
          type: 'interview',
          title: `Interview: ${app.position} at ${app.companyName}`,
          subtitle,
          date: app.interviewDate,
          urgency,
          daysDiff: diffDays,
        });
      }

      // 3. Assessment reminders
      if (app.assessmentDate) {
        const aDate = new Date(app.assessmentDate);
        const aDateMidnight = new Date(aDate.getFullYear(), aDate.getMonth(), aDate.getDate()).getTime();
        const diffDays = Math.round((aDateMidnight - todayMidnight) / (1000 * 60 * 60 * 24));

        let urgency: ReminderUrgency = 'upcoming';
        let subtitle = `Due in ${diffDays} days`;

        if (diffDays < 0) {
          urgency = 'overdue';
          subtitle = `Past due date (${aDate.toLocaleDateString()})`;
        } else if (diffDays === 0) {
          urgency = 'today';
          subtitle = 'Assessment due today';
        } else if (diffDays === 1) {
          urgency = 'upcoming';
          subtitle = 'Due tomorrow';
        }

        reminders.push({
          id: `rem-a-${app.id}`,
          applicationId: app.id,
          application: app,
          companyName: app.companyName,
          position: app.position,
          type: 'assessment',
          title: `Assessment: ${app.companyName}`,
          subtitle,
          date: app.assessmentDate,
          urgency,
          daysDiff: diffDays,
        });
      }
    });

    // Sort: overdue first, then today, then upcoming sorted by date
    reminders.sort((a, b) => a.daysDiff - b.daysDiff);

    const overdue = reminders.filter((r) => r.urgency === 'overdue');
    const today = reminders.filter((r) => r.urgency === 'today');
    const upcoming = reminders.filter((r) => r.urgency === 'upcoming');

    return {
      all: reminders,
      overdue,
      today,
      upcoming,
    };
  }
}

export const reminderService = new ReminderService();
