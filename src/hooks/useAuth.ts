import { useCallback } from 'react';
import { useAuthStore } from '../store/authStore';
import * as authAPI from '../api/auth';

export const useAuth = () => {
  const { user, isAuthenticated, isHydrated, isLoading, error, setUser, setTokens, setLoading, setError, clearAuth, hydrateAuth } = useAuthStore();

  const register = useCallback(async (email: string, password: string, fullName: string) => {
    setLoading(true);
    setError(null);
    try {
      const tokens = await authAPI.register({ email, password, full_name: fullName });
      setTokens(tokens);
      
      // Fetch current user
      const currentUser = await authAPI.getCurrentUser();
      setUser(currentUser);
      
      return true;
    } catch (err: any) {
      const message = err.response?.data?.detail || 'Registration failed';
      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  }, [setUser, setTokens, setLoading, setError]);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const tokens = await authAPI.login({ email, password });
      setTokens(tokens);
      
      // Fetch current user
      const currentUser = await authAPI.getCurrentUser();
      setUser(currentUser);
      
      return true;
    } catch (err: any) {
      const message = err.response?.data?.detail || 'Login failed';
      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  }, [setUser, setTokens, setLoading, setError]);

  const logout = useCallback(() => {
    clearAuth();
    authAPI.logout();
  }, [clearAuth]);

  const fetchCurrentUser = useCallback(async () => {
    try {
      const currentUser = await authAPI.getCurrentUser();
      setUser(currentUser);
      return currentUser;
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to fetch user');
      return null;
    }
  }, [setUser, setError]);

  return {
    user,
    isAuthenticated,
    isHydrated,
    isLoading,
    error,
    register,
    login,
    logout,
    fetchCurrentUser,
    hydrateAuth,
  };
};
