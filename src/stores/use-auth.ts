import { useEffect } from 'react';
import { useUserStore } from './user-store';

export const useAuth = () => {
  const {
    user,
    token,
    isLoading,
    error,
    isAuthenticated,
    login,
    register,
    logout,
    clearError,
    checkAuthStatus,
    updateProfile,
  } = useUserStore();

  // Check auth status on mount - only once without automatic refresh
  useEffect(() => {
    // Only check if we have stored data but haven't verified authentication yet
    if ((token || user) && isAuthenticated === false) {
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
  const getAuthHeader = () => token ? `Bearer ${token}` : null;
  const isTokenExpired = () => {
    if (!token) return true;
    // Add token expiry logic here if needed
    return false;
  };

  return {
    // State
    user,
    isAuthenticated,
    isLoading,
    error,
    token,
    
    // Actions
    login,
    register,
    logout,
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
