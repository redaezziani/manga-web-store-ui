import { useEffect } from 'react';
import { useUserStore } from './user-store';

export const useAuth = () => {
  const {
    user,
    accessToken,
    refreshToken,
    isLoading,
    error,
    isAuthenticated,
    login,
    register,
    logout,
    refreshAccessToken,
    clearError,
    checkAuthStatus,
    updateProfile,
  } = useUserStore();

  // Check auth status on mount - only once without automatic refresh
  useEffect(() => {
    // Only check if we have stored data but haven't verified authentication yet
    if ((accessToken || user) && isAuthenticated === false) {
      checkAuthStatus();
    }
  }, []); // Empty dependency array to run only once on mount

  // Helper functions
  const getDisplayName = () => user?.displayName || user?.firstName || 'User';
  const getFullName = () => user ? `${user.firstName} ${user.lastName}` : '';
  const getInitials = () => {
    if (!user) return '';
    return `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase();
  };
  
  const hasRole = (role: string) => user?.role === role;
  const isAdmin = () => hasRole('ADMIN');
  const isEmailVerified = () => user?.isEmailVerified || false;
  const isActive = () => user?.status === 'ACTIVE';

  // Token helpers
  const getAuthHeader = () => accessToken ? `Bearer ${accessToken}` : null;
  const isTokenExpired = () => {
    if (!accessToken) return true;
    // Add token expiry logic here if needed
    return false;
  };

  return {
    // State
    user,
    isAuthenticated,
    isLoading,
    error,
    accessToken,
    refreshToken,
    
    // Actions
    login,
    register,
    logout,
    refreshAccessToken,
    clearError,
    updateProfile,
    
    // Helpers
    getDisplayName,
    getFullName,
    getInitials,
    hasRole,
    isAdmin,
    isEmailVerified,
    isActive,
    getAuthHeader,
    isTokenExpired,
  };
};
