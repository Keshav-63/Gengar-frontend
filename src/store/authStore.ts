import { create } from 'zustand';
import { User, TokenResponse } from '../types';
import {
  clearStoredAuth,
  getStoredAccessToken,
  setStoredAccessToken,
  setStoredRefreshToken,
} from '../utils/authStorage';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  isLoading: boolean;
  error: string | null;
  
  setUser: (user: User | null) => void;
  setTokens: (tokens: TokenResponse) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearAuth: () => void;
  
  // Hydrate from localStorage
  hydrateAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: !!getStoredAccessToken(),
  isHydrated: false,
  isLoading: false,
  error: null,

  setUser: (user) => set({ user, isAuthenticated: !!user }),
  
  setTokens: (tokens) => {
    if (tokens.access_token) {
      setStoredAccessToken(tokens.access_token);
    }
    if (tokens.refresh_token) {
      setStoredRefreshToken(tokens.refresh_token);
    }
    set({ isAuthenticated: true, isHydrated: true });
  },

  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),

  clearAuth: () => {
    clearStoredAuth();
    set({ user: null, isAuthenticated: false, isHydrated: true, error: null });
  },

  hydrateAuth: () => {
    const token = getStoredAccessToken();
    set({ isAuthenticated: !!token, isHydrated: true });
  },
}));
