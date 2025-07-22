/**
 * Storage configuration for the manga web store
 * 
 * This file centralizes storage configuration for easy switching between
 * localStorage and cookies across the application.
 */

import { UnifiedStorage, type StorageType } from '@/lib/storage';
import { createJSONStorage } from 'zustand/middleware';

// Main storage configuration - Change this to switch storage type globally
export const STORAGE_CONFIG = {
  // Change to 'cookies' to use cookies instead of localStorage
  type: 'localStorage' as StorageType,
  
  // Storage keys
  keys: {
    user: 'user-storage',
    preferences: 'user-preferences',
    theme: 'theme-preference',
  },
  
  // Cookie settings (only used when type is 'cookies')
  cookieOptions: {
    expires: 30, // days
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
  }
};

// Create storage instances
export const userStorage = new UnifiedStorage(
  STORAGE_CONFIG.type,
  STORAGE_CONFIG.type === 'cookies' ? STORAGE_CONFIG.cookieOptions : undefined
);

export const preferencesStorage = new UnifiedStorage(
  STORAGE_CONFIG.type,
  STORAGE_CONFIG.type === 'cookies' ? STORAGE_CONFIG.cookieOptions : undefined
);

// Custom storage adapter for Zustand persist middleware
export const createZustandStorage = (storageInstance: UnifiedStorage) => 
  createJSONStorage(() => ({
    getItem: (name: string) => {
      const value = storageInstance.getItem(name);
      return value ? JSON.stringify(value) : null;
    },
    setItem: (name: string, value: string) => {
      try {
        const parsedValue = JSON.parse(value);
        storageInstance.setItem(name, parsedValue);
      } catch {
        storageInstance.setItem(name, value);
      }
    },
    removeItem: (name: string) => {
      storageInstance.removeItem(name);
    },
  }));

// Utility functions for manual storage operations
export const storage = {
  user: {
    set: (key: string, value: any) => userStorage.setItem(key, value),
    get: (key: string) => userStorage.getItem(key),
    remove: (key: string) => userStorage.removeItem(key),
    clear: () => userStorage.clear(),
  },
  
  preferences: {
    set: (key: string, value: any) => preferencesStorage.setItem(key, value),
    get: (key: string) => preferencesStorage.getItem(key),
    remove: (key: string) => preferencesStorage.removeItem(key),
    clear: () => preferencesStorage.clear(),
  },
  
  // Utility to clear all app data
  clearAll: () => {
    userStorage.clear();
    preferencesStorage.clear();
  }
};

// Export for easy access in components
export { STORAGE_CONFIG as default };
