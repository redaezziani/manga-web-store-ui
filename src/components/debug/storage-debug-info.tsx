/**
 * Storage debug component for development
 */

'use client';

import { useStorageManager } from '@/hooks/use-storage-manager';

/**
 * Storage status component for debugging (development only)
 */
export const StorageDebugInfo = () => {
  const { getStorageInfo } = useStorageManager();
  
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  const info = getStorageInfo();
  
  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-2 rounded text-xs z-50">
      <div>Storage: {info.currentType}</div>
      <div>User Data: {info.hasUserData ? '✓' : '✗'}</div>
      <div>Authenticated: {info.isAuthenticated ? '✓' : '✗'}</div>
    </div>
  );
};
