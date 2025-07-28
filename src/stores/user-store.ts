import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, AuthResponse, LoginRequest, RegisterRequest } from '@/types/manga';
import { userStorage, createZustandStorage, STORAGE_CONFIG } from '@/config/storage';

interface UserStore {
  user: User | null;
  token: string | null;
  expiresIn: number | null;
  tokenExpiry: number | null; // Timestamp when token expires
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  
  // Actions
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  checkAuthStatus: () => void;
  updateProfile: (updates: Partial<User>) => void;
  isTokenExpired: () => boolean;
  getValidToken: () => string | null;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      expiresIn: null,
      tokenExpiry: null,
      isLoading: false,
      error: null,
      isAuthenticated: false,

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
              token: data.data.token,
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
              token: data.data.token,
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
          token: null,
          expiresIn: null,
          tokenExpiry: null,
          isAuthenticated: false,
          error: null,
        });
      },

      clearError: () => set({ error: null }),

      checkAuthStatus: () => {
        const { token, user, tokenExpiry } = get();
        
        if (token && user) {
          // Check if token is expired
          if (tokenExpiry && Date.now() >= tokenExpiry) {
            // Token is expired, logout user
            get().logout();
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

      getValidToken: (): string | null => {
        const { token, isTokenExpired } = get();
        
        if (!token) return null;
        
        // If token is expired, return null
        if (isTokenExpired()) {
          get().logout();
          return null;
        }
        
        return token;
      },
    }),
    {
      name: STORAGE_CONFIG.keys.user,
      storage: createZustandStorage(userStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        expiresIn: state.expiresIn,
        tokenExpiry: state.tokenExpiry,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
