// Authentication hook
import { useState, useEffect } from 'react';
import { authApi, usersApi, type UserProfile } from '@/api';
import { getAuthToken } from '@/api/config';

export function useAuth() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkAuth = async () => {
    const token = getAuthToken();
    
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const profile = await usersApi.getProfile();
      setUser(profile);
    } catch (err: any) {
      console.error('Auth check failed:', err);
      setError(err?.error?.message || 'Authentication failed');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authApi.login({ email, password });
      
      if (response.success) {
        setUser(response.data.user as any);
        return true;
      }
      return false;
    } catch (err: any) {
      console.error('Login failed:', err);
      setError(err?.error?.message || 'Login failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
    }
  };

  return {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    logout,
    refetch: checkAuth,
  };
}
