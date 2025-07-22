/**
 * Storage management hooks and utilities
 * 
 * Provides utilities for managing user data persistence,
 * including the ability to migrate between storage types.
 */

import { useCallback } from 'react';
import { useUserStore } from '@/stores/user-store';
import { storage, STORAGE_CONFIG } from '@/config/storage';

export const useStorageManager = () => {
  const user = useUserStore((state) => state.user);
  const logout = useUserStore((state) => state.logout);

  /**
   * Get current storage type
   */
  const getCurrentStorageType = useCallback(() => {
    return STORAGE_CONFIG.type;
  }, []);

  /**
   * Check if user data exists in storage
   */
  const hasStoredUserData = useCallback(() => {
    const userData = storage.user.get(STORAGE_CONFIG.keys.user);
    return userData && userData.user && userData.accessToken;
  }, []);

  /**
   * Clear all stored user data
   */
  const clearStoredData = useCallback(() => {
    storage.clearAll();
  }, []);

  /**
   * Export user data for migration
   */
  const exportUserData = useCallback(() => {
    const userData = storage.user.get(STORAGE_CONFIG.keys.user);
    const preferences = storage.preferences.get(STORAGE_CONFIG.keys.preferences);
    
    return {
      userData,
      preferences,
      exportedAt: new Date().toISOString(),
      storageType: STORAGE_CONFIG.type
    };
  }, []);

  /**
   * Get storage information for debugging
   */
  const getStorageInfo = useCallback(() => {
    return {
      currentType: STORAGE_CONFIG.type,
      hasUserData: hasStoredUserData(),
      isAuthenticated: !!user,
      keys: STORAGE_CONFIG.keys
    };
  }, [user, hasStoredUserData]);

  return {
    getCurrentStorageType,
    hasStoredUserData,
    clearStoredData,
    exportUserData,
    getStorageInfo,
    logout
  };
};
