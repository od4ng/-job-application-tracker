export interface IStorageAdapter {
  getItem<T>(key: string): T | null;
  setItem<T>(key: string, value: T): void;
  removeItem(key: string): void;
  clear(): void;
}

class LocalStorageAdapter implements IStorageAdapter {
  private prefix = 'jobtracker_v1_';

  getItem<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(this.prefix + key);
      return item ? (JSON.parse(item) as T) : null;
    } catch (e) {
      console.error(`Error reading key ${key} from storage:`, e);
      return null;
    }
  }

  setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(this.prefix + key, JSON.stringify(value));
    } catch (e) {
      console.error(`Error writing key ${key} to storage:`, e);
    }
  }

  removeItem(key: string): void {
    try {
      localStorage.removeItem(this.prefix + key);
    } catch (e) {
      console.error(`Error removing key ${key} from storage:`, e);
    }
  }

  clear(): void {
    try {
      Object.keys(localStorage)
        .filter((k) => k.startsWith(this.prefix))
        .forEach((k) => localStorage.removeItem(k));
    } catch (e) {
      console.error('Error clearing storage:', e);
    }
  }

  clearAll(): void {
    this.clear();
  }
}

export const storage = new LocalStorageAdapter();
