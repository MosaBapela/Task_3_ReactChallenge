// Utility functions for safe localStorage operations

/**
 * Safely get an item from localStorage
 * @param key - The key to retrieve
 * @param defaultValue - Default value if key doesn't exist or parsing fails
 * @returns Parsed value or default value
 */
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
  
  /**
   * Safely set an item in localStorage
   * @param key - The key to set
   * @param value - The value to store
   * @returns boolean indicating success
   */
  export function setInStorage<T>(key: string, value: T): boolean {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error writing to localStorage key "${key}":`, error);
      return false;
    }
  }
  
  /**
   * Safely remove an item from localStorage
   * @param key - The key to remove
   * @returns boolean indicating success
   */
  export function removeFromStorage(key: string): boolean {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing from localStorage key "${key}":`, error);
      return false;
    }
  }
  
  /**
   * Clear all localStorage data for the app
   * This removes all job tracker related data
   */
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
  
  /**
   * Check if localStorage is available
   * @returns boolean indicating if localStorage is supported
   */
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
  
  // Storage keys used throughout the app
  export const STORAGE_KEYS = {
    USERS: 'job_tracker_users',
    CURRENT_USER: 'job_tracker_current_user',
    JOBS: 'job_tracker_jobs',
  } as const;