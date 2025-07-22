import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, AuthResponse, LoginRequest, RegisterRequest } from '@/types/manga';
import { userStorage, createZustandStorage, STORAGE_CONFIG } from '@/config/storage';

interface UserStore {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  expiresIn: number | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  refreshAttempted: boolean; // Track if we've already tried to refresh
  
  // Actions
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => void;
  refreshAccessToken: () => Promise<void>;
  clearError: () => void;
  checkAuthStatus: () => void;
  updateProfile: (updates: Partial<User>) => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      expiresIn: null,
      isLoading: false,
      error: null,
      isAuthenticated: false,
      refreshAttempted: false,

      login: async (credentials: LoginRequest) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await fetch('http://localhost:7000/api/v1/auth/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'accept': 'application/json',
            },
            body: JSON.stringify(credentials),
          });
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          const data: AuthResponse = await response.json();
          
          if (data.success) {
            set({
              user: data.data.user,
              accessToken: data.data.accessToken,
              refreshToken: data.data.refreshToken,
              expiresIn: data.data.expiresIn,
              isAuthenticated: true,
              isLoading: false,
              refreshAttempted: false, // Reset on successful login
            });
          } else {
            throw new Error(data.message || 'Login failed');
          }
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Login failed',
            isLoading: false,
          });
        }
      },

      register: async (userData: RegisterRequest) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await fetch('http://localhost:7000/api/v1/auth/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'accept': 'application/json',
            },
            body: JSON.stringify(userData),
          });
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          const data: AuthResponse = await response.json();
          
          if (data.success) {
            set({
              user: data.data.user,
              accessToken: data.data.accessToken,
              refreshToken: data.data.refreshToken,
              expiresIn: data.data.expiresIn,
              isAuthenticated: true,
              isLoading: false,
              refreshAttempted: false, // Reset on successful registration
            });
          } else {
            throw new Error(data.message || 'Registration failed');
          }
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Registration failed',
            isLoading: false,
          });
        }
      },

      logout: () => {
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          expiresIn: null,
          isAuthenticated: false,
          error: null,
          refreshAttempted: false, // Reset refresh flag on logout
        });
      },

      refreshAccessToken: async () => {
        const { refreshToken, refreshAttempted } = get();
        
        if (!refreshToken || refreshAttempted) {
          set({ isAuthenticated: false });
          return;
        }

        // Mark that we've attempted refresh to prevent loops
        set({ refreshAttempted: true });

        try {
          // Check if refresh endpoint exists first
          const response = await fetch('http://localhost:7000/api/v1/auth/refresh', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'accept': 'application/json',
            },
            body: JSON.stringify({ refreshToken }),
          });
          
          if (response.status === 404) {
            // Refresh endpoint doesn't exist, just logout
            console.warn('Token refresh endpoint not available');
            get().logout();
            return;
          }
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          const data: AuthResponse = await response.json();
          
          if (data.success) {
            set({
              accessToken: data.data.accessToken,
              refreshToken: data.data.refreshToken,
              expiresIn: data.data.expiresIn,
              user: data.data.user,
              isAuthenticated: true,
              refreshAttempted: false, // Reset on success
            });
          } else {
            throw new Error(data.message || 'Token refresh failed');
          }
        } catch (error) {
          // If refresh fails, logout user
          console.warn('Token refresh failed:', error);
          get().logout();
        }
      },

      clearError: () => set({ error: null }),

      checkAuthStatus: () => {
        const { accessToken, user } = get();
        
        // Simple check: if we have both token and user, consider authenticated
        if (accessToken && user) {
          set({ isAuthenticated: true });
        } else {
          set({ isAuthenticated: false });
        }
        
        // Note: Token expiration checking is disabled since refresh endpoint may not exist
        // In a production app, you would implement proper token validation here
      },

      updateProfile: (updates: Partial<User>) => {
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: { ...currentUser, ...updates }
          });
        }
      },
    }),
    {
      name: STORAGE_CONFIG.keys.user,
      storage: createZustandStorage(userStorage),
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        expiresIn: state.expiresIn,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
