/**
 * Storage utilities for localStorage and cookies
 */

export type StorageType = 'localStorage' | 'cookies';

// Cookie utilities
export const cookies = {
  set: (name: string, value: string, days: number = 30, options: { secure?: boolean; sameSite?: 'strict' | 'lax' | 'none' } = {}): void => {
    if (typeof window === 'undefined') return;
    
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    
    const secure = options.secure !== undefined ? options.secure : (window.location.protocol === 'https:');
    const sameSite = options.sameSite || 'strict';
    
    const cookieString = [
      `${name}=${encodeURIComponent(value)}`,
      `expires=${expires.toUTCString()}`,
      'path=/',
      secure ? 'secure' : '',
      `samesite=${sameSite}`
    ].filter(Boolean).join(';');
    
    document.cookie = cookieString;
  },

  get: (name: string): string | null => {
    if (typeof window === 'undefined') return null;
    
    const nameEQ = `${name}=`;
    const ca = document.cookie.split(';');
    
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) {
        return decodeURIComponent(c.substring(nameEQ.length, c.length));
      }
    }
    return null;
  },

  remove: (name: string): void => {
    if (typeof window === 'undefined') return;
    
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
  },

  clear: (): void => {
    if (typeof window === 'undefined') return;
    
    const cookies = document.cookie.split(';');
    
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i];
      const eqPos = cookie.indexOf('=');
      const name = eqPos > -1 ? cookie.substring(0, eqPos).trim() : cookie.trim();
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
    }
  }
};

// localStorage utilities with error handling
export const localStorage = {
  set: (key: string, value: any): boolean => {
    if (typeof window === 'undefined') return false;
    
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.warn('Failed to save to localStorage:', error);
      return false;
    }
  },

  get: (key: string): any => {
    if (typeof window === 'undefined') return null;
    
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.warn('Failed to read from localStorage:', error);
      return null;
    }
  },

  remove: (key: string): boolean => {
    if (typeof window === 'undefined') return false;
    
    try {
      window.localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn('Failed to remove from localStorage:', error);
      return false;
    }
  },

  clear: (): boolean => {
    if (typeof window === 'undefined') return false;
    
    try {
      window.localStorage.clear();
      return true;
    } catch (error) {
      console.warn('Failed to clear localStorage:', error);
      return false;
    }
  }
};

// Unified storage interface
export class UnifiedStorage {
  private storageType: StorageType;
  private cookieOptions: { expires?: number; secure?: boolean; sameSite?: 'strict' | 'lax' | 'none' };

  constructor(type: StorageType = 'localStorage', cookieOptions: { expires?: number; secure?: boolean; sameSite?: 'strict' | 'lax' | 'none' } = {}) {
    this.storageType = type;
    this.cookieOptions = {
      expires: 30,
      secure: false,
      sameSite: 'strict',
      ...cookieOptions
    };
  }

  setItem(key: string, value: any): boolean {
    if (this.storageType === 'cookies') {
      cookies.set(key, JSON.stringify(value), this.cookieOptions.expires, {
        secure: this.cookieOptions.secure,
        sameSite: this.cookieOptions.sameSite
      });
      return true;
    } else {
      return localStorage.set(key, value);
    }
  }

  getItem(key: string): any {
    if (this.storageType === 'cookies') {
      const value = cookies.get(key);
      try {
        return value ? JSON.parse(value) : null;
      } catch {
        return value;
      }
    } else {
      return localStorage.get(key);
    }
  }

  removeItem(key: string): boolean {
    if (this.storageType === 'cookies') {
      cookies.remove(key);
      return true;
    } else {
      return localStorage.remove(key);
    }
  }

  clear(): boolean {
    if (this.storageType === 'cookies') {
      cookies.clear();
      return true;
    } else {
      return localStorage.clear();
    }
  }
}

// Create default storage instance
export const storage = new UnifiedStorage('localStorage');
