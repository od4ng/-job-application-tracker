import { User } from '../types';
import { storage } from './storage';

const USERS_KEY = 'users_db';

export class UserService {
  public getAllUsers(): User[] {
    return storage.getItem<User[]>(USERS_KEY) || [];
  }

  public getUserById(id: string): User | null {
    const users = this.getAllUsers();
    return users.find((u) => u.id === id) || null;
  }

  public searchClassmates(query: string, currentUserId: string): User[] {
    const users = this.getAllUsers();
    const otherUsers = users.filter((u) => u.id !== currentUserId);

    if (!query.trim()) {
      return otherUsers;
    }

    const q = query.toLowerCase().trim();
    return otherUsers.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.username.toLowerCase().includes(q) ||
        u.school.toLowerCase().includes(q) ||
        u.course.toLowerCase().includes(q) ||
        u.preferredRole.toLowerCase().includes(q) ||
        u.skills.some((s) => s.toLowerCase().includes(q))
    );
  }
}

export const userService = new UserService();
