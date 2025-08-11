
export function getFromStorage<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key);
      if (item === null) {
        return defaultValue;
      }
      return JSON.parse(item);
    } catch (error) {
      console.error(`Error reading from localStorage key "${key}":`, error);
      return defaultValue;
    }
  }
  

  export function setInStorage<T>(key: string, value: T): boolean {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error writing to localStorage key "${key}":`, error);
      return false;
    }
  }
  

  export function removeFromStorage(key: string): boolean {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing from localStorage key "${key}":`, error);
      return false;
    }
  }
  

  export function clearAllAppData(): void {
    try {
      const keys = Object.keys(localStorage);
      const appKeys = keys.filter(key => key.startsWith('job_tracker_'));
      
      appKeys.forEach(key => {
        localStorage.removeItem(key);
      });
    } catch (error) {
      console.error('Error clearing app data:', error);
    }
  }
  

  export function isLocalStorageAvailable(): boolean {
    try {
      const testKey = '__localStorage_test__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }
  

  export const STORAGE_KEYS = {
    USERS: 'job_tracker_users',
    CURRENT_USER: 'job_tracker_current_user',
    JOBS: 'job_tracker_jobs',
  } as const;