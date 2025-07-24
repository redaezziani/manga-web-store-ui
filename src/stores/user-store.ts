import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, AuthResponse, LoginRequest, RegisterRequest } from '@/types/manga';
import { userStorage, createZustandStorage, STORAGE_CONFIG } from '@/config/storage';

interface UserStore {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  expiresIn: number | null;
  tokenExpiry: number | null; // Timestamp when token expires
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  isRefreshing: boolean; // Track if we're currently refreshing
  
  // Actions
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => void;
  refreshAccessToken: () => Promise<boolean>;
  clearError: () => void;
  checkAuthStatus: () => void;
  updateProfile: (updates: Partial<User>) => void;
  isTokenExpired: () => boolean;
  getValidToken: () => Promise<string | null>;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      expiresIn: null,
      tokenExpiry: null,
      isLoading: false,
      error: null,
      isAuthenticated: false,
      isRefreshing: false,

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
            const tokenExpiry = Date.now() + (data.data.expiresIn * 1000);
            
            set({
              user: data.data.user,
              accessToken: data.data.accessToken,
              refreshToken: data.data.refreshToken,
              expiresIn: data.data.expiresIn,
              tokenExpiry,
              isAuthenticated: true,
              isLoading: false,
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
            const tokenExpiry = Date.now() + (data.data.expiresIn * 1000);
            
            set({
              user: data.data.user,
              accessToken: data.data.accessToken,
              refreshToken: data.data.refreshToken,
              expiresIn: data.data.expiresIn,
              tokenExpiry,
              isAuthenticated: true,
              isLoading: false,
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
          tokenExpiry: null,
          isAuthenticated: false,
          error: null,
          isRefreshing: false,
        });
      },

      refreshAccessToken: async (): Promise<boolean> => {
        const { refreshToken, isRefreshing } = get();
        
        if (!refreshToken || isRefreshing) {
          return false;
        }

        // Prevent multiple simultaneous refresh attempts
        set({ isRefreshing: true });

        try {
          const response = await fetch('http://localhost:7000/api/v1/auth/refresh', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'accept': 'application/json',
            },
            body: JSON.stringify({ refreshToken }),
          });
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          const data: AuthResponse = await response.json();
          
          if (data.success) {
            const tokenExpiry = Date.now() + (data.data.expiresIn * 1000);
            
            set({
              accessToken: data.data.accessToken,
              refreshToken: data.data.refreshToken,
              expiresIn: data.data.expiresIn,
              tokenExpiry,
              user: data.data.user,
              isAuthenticated: true,
              isRefreshing: false,
            });
            return true;
          } else {
            throw new Error(data.message || 'Token refresh failed');
          }
        } catch (error) {
          console.warn('Token refresh failed:', error);
          get().logout();
          return false;
        }
      },

      clearError: () => set({ error: null }),

      checkAuthStatus: () => {
        const { accessToken, user, tokenExpiry } = get();
        
        if (accessToken && user) {
          // Check if token is expired
          if (tokenExpiry && Date.now() >= tokenExpiry) {
            // Token is expired, attempt refresh
            get().refreshAccessToken();
          } else {
            set({ isAuthenticated: true });
          }
        } else {
          set({ isAuthenticated: false });
        }
      },

      updateProfile: (updates: Partial<User>) => {
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: { ...currentUser, ...updates }
          });
        }
      },

      isTokenExpired: (): boolean => {
        const { tokenExpiry } = get();
        if (!tokenExpiry) return true;
        return Date.now() >= tokenExpiry;
      },

      getValidToken: async (): Promise<string | null> => {
        const { accessToken, isTokenExpired, refreshAccessToken } = get();
        
        if (!accessToken) return null;
        
        // If token is expired, try to refresh
        if (isTokenExpired()) {
          const refreshed = await refreshAccessToken();
          if (refreshed) {
            return get().accessToken;
          }
          return null;
        }
        
        return accessToken;
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
        tokenExpiry: state.tokenExpiry,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
