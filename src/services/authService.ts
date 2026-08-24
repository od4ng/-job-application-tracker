import { User } from '../types';
import { storage } from './storage';
import {
  SEED_USERS,
  SEED_APPLICATIONS,
  SEED_TIMELINE,
  SEED_NOTIFICATIONS,
} from './seedData';

const USERS_KEY = 'users_db';
const CURRENT_USER_KEY = 'current_user_session';
const INITIALIZED_KEY = 'database_initialized_fresh_v3';

export class AuthService {
  constructor() {
    this.ensureInitialized();
  }

  public ensureInitialized(): void {
    const isInit = storage.getItem<boolean>(INITIALIZED_KEY);
    if (!isInit) {
      storage.clearAll();
      storage.setItem<User[]>(USERS_KEY, SEED_USERS);
      storage.removeItem(CURRENT_USER_KEY);
      storage.setItem('applications_db', SEED_APPLICATIONS);
      storage.setItem('timeline_db', SEED_TIMELINE);
      storage.setItem('notifications_db', SEED_NOTIFICATIONS);
      storage.setItem(INITIALIZED_KEY, true);
    }
  }

  public getCurrentUser(): User | null {
    return storage.getItem<User>(CURRENT_USER_KEY);
  }

  public getUsers(): User[] {
    return storage.getItem<User[]>(USERS_KEY) || [];
  }

  public login(identifier: string, _password?: string): { success: boolean; user?: User; error?: string } {
    const users = this.getUsers();
    const cleanId = identifier.trim().toLowerCase();

    const matchedUser = users.find(
      (u) =>
        u.email.toLowerCase() === cleanId ||
        u.username.toLowerCase() === cleanId.replace('@', '')
    );

    if (!matchedUser) {
      return { success: false, error: 'No account found with this email or username. Please create a new account.' };
    }

    storage.setItem(CURRENT_USER_KEY, matchedUser);
    return { success: true, user: matchedUser };
  }

  public register(data: {
    name: string;
    username: string;
    email: string;
    school: string;
    course: string;
    graduationYear: string | number;
    preferredRole: string;
    location?: string;
    skills?: string[];
    bio?: string;
  }): { success: boolean; user?: User; error?: string } {
    const users = this.getUsers();
    const cleanEmail = data.email.trim().toLowerCase();
    const cleanUsername = data.username.trim().toLowerCase().replace('@', '');

    if (users.some((u) => u.email.toLowerCase() === cleanEmail)) {
      return { success: false, error: 'An account with this email already exists.' };
    }
    if (users.some((u) => u.username.toLowerCase() === cleanUsername)) {
      return { success: false, error: 'Username is already taken. Please choose another.' };
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      name: data.name.trim(),
      username: cleanUsername,
      email: cleanEmail,
      avatarUrl: '',
      school: data.school.trim(),
      course: data.course.trim(),
      graduationYear: String(data.graduationYear).trim(),
      location: data.location?.trim() || '',
      preferredRole: data.preferredRole.trim(),
      skills: data.skills || [],
      skillCategories: [],
      experiences: [],
      projects: [],
      bio: data.bio || '',
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    storage.setItem(USERS_KEY, users);
    storage.setItem(CURRENT_USER_KEY, newUser);

    return { success: true, user: newUser };
  }

  public logout(): void {
    storage.removeItem(CURRENT_USER_KEY);
  }

  public switchDemoAccount(userId: string): User | null {
    const users = this.getUsers();
    const user = users.find((u) => u.id === userId);
    if (user) {
      storage.setItem(CURRENT_USER_KEY, user);
      return user;
    }
    return null;
  }

  public updateProfile(userId: string, updates: Partial<User>): User | null {
    const users = this.getUsers();
    const index = users.findIndex((u) => u.id === userId);
    if (index === -1) return null;

    const updatedUser = { ...users[index], ...updates };
    users[index] = updatedUser;
    storage.setItem(USERS_KEY, users);

    const currentUser = this.getCurrentUser();
    if (currentUser && currentUser.id === userId) {
      storage.setItem(CURRENT_USER_KEY, updatedUser);
    }

    return updatedUser;
  }

  public requestPasswordReset(email: string): { success: boolean; message: string } {
    const users = this.getUsers();
    const cleanEmail = email.trim().toLowerCase();
    const user = users.find((u) => u.email.toLowerCase() === cleanEmail);

    if (!user) {
      return {
        success: false,
        message: 'No account found with this email address.',
      };
    }

    return {
      success: true,
      message: `Password reset instructions have been generated for ${user.email}.`,
    };
  }

  public resetPassword(email: string, _newPassword: string): { success: boolean; message: string } {
    const users = this.getUsers();
    const user = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
    if (!user) {
      return { success: false, message: 'Account not found.' };
    }
    return {
      success: true,
      message: 'Password successfully updated. You can now login with your new credentials.',
    };
  }

  public changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): { success: boolean; message?: string; error?: string } {
    const users = this.getUsers();
    const user = users.find((u) => u.id === userId);
    if (!user) {
      return { success: false, error: 'User account not found.' };
    }
    if (!currentPassword || currentPassword.trim().length === 0) {
      return { success: false, error: 'Current password is required.' };
    }
    if (!newPassword || newPassword.trim().length < 6) {
      return { success: false, error: 'New password must be at least 6 characters.' };
    }
    return {
      success: true,
      message: 'Your password has been changed successfully.',
    };
  }

  public resetDatabase(): void {
    storage.clearAll();
    this.ensureInitialized();
  }
}

export const authService = new AuthService();
