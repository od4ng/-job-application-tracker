import { AppNotification } from '../types';
import { storage } from './storage';
import { applicationService } from './applicationService';

const NOTIFICATIONS_KEY = 'notifications_db';

export class NotificationService {
  private getNotificationsRaw(): AppNotification[] {
    return storage.getItem<AppNotification[]>(NOTIFICATIONS_KEY) || [];
  }

  private saveNotificationsRaw(notifications: AppNotification[]): void {
    storage.setItem(NOTIFICATIONS_KEY, notifications);
  }

  public getUserNotifications(userId: string): AppNotification[] {
    if (!userId) return [];
    const all = this.getNotificationsRaw();
    return all
      .filter((n) => n.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public getUnreadCount(userId: string): number {
    const userNotifs = this.getUserNotifications(userId);
    return userNotifs.filter((n) => !n.read).length;
  }

  public markAsRead(notificationId: string): void {
    const all = this.getNotificationsRaw();
    const target = all.find((n) => n.id === notificationId);
    if (target) {
      target.read = true;
      this.saveNotificationsRaw(all);
    }
  }

  public markAllAsRead(userId: string): void {
    const all = this.getNotificationsRaw();
    all.forEach((n) => {
      if (n.userId === userId) {
        n.read = true;
      }
    });
    this.saveNotificationsRaw(all);
  }

  public deleteNotification(notificationId: string): void {
    const all = this.getNotificationsRaw();
    const filtered = all.filter((n) => n.id !== notificationId);
    this.saveNotificationsRaw(filtered);
  }

  public clearAll(userId: string): void {
    const all = this.getNotificationsRaw();
    const filtered = all.filter((n) => n.userId !== userId);
    this.saveNotificationsRaw(filtered);
  }

  public createNotification(
    userId: string,
    data: Omit<AppNotification, 'id' | 'userId' | 'read' | 'createdAt'>
  ): AppNotification {
    const all = this.getNotificationsRaw();
    const newNotif: AppNotification = {
      ...data,
      id: `notif-${Date.now()}`,
      userId,
      read: false,
      createdAt: new Date().toISOString(),
    };
    all.unshift(newNotif);
    this.saveNotificationsRaw(all);
    return newNotif;
  }

  // Scan user's applications for any pending follow-ups or upcoming interviews and sync notifications
  public syncReminders(userId: string): void {
    const apps = applicationService.getUserApplications(userId);
    const existing = this.getUserNotifications(userId);
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    apps.forEach((app) => {
      if (app.followUpDate) {
        const fDate = new Date(app.followUpDate);
        fDate.setHours(0, 0, 0, 0);
        const diffDays = Math.ceil((fDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

        if (diffDays <= 1 && diffDays >= -3) {
          const alreadyNotified = existing.some(
            (n) => n.relatedId === app.id && n.type === 'followup'
          );
          if (!alreadyNotified) {
            this.createNotification(userId, {
              title: diffDays < 0 ? 'Overdue Follow-up' : 'Follow-up Due Soon',
              message: `Reminder to follow up with ${app.companyName} for the ${app.position} role.`,
              type: 'followup',
              relatedId: app.id,
            });
          }
        }
      }

      if (app.interviewDate) {
        const iDate = new Date(app.interviewDate);
        const diffHours = (iDate.getTime() - new Date().getTime()) / (1000 * 60 * 60);

        if (diffHours > 0 && diffHours <= 48) {
          const alreadyNotified = existing.some(
            (n) => n.relatedId === app.id && n.type === 'interview'
          );
          if (!alreadyNotified) {
            this.createNotification(userId, {
              title: 'Upcoming Interview',
              message: `Interview with ${app.companyName} is scheduled in ${Math.round(diffHours)} hours.`,
              type: 'interview',
              relatedId: app.id,
            });
          }
        }
      }
    });
  }
}

export const notificationService = new NotificationService();
