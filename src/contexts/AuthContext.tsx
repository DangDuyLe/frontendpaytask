'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi, usersApi, type UserProfile } from '@/api';
import { getAuthToken, setAuthToken, removeAuthToken } from '@/api/config';

interface AuthContextType {
  user: UserProfile | null;
  userId: string | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  refetch: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
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
      // Clear invalid token
      removeAuthToken();
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
      
      if (response.success && response.data.accessToken) {
        // Store token (already done in authApi.login)
        // But we ensure it's set
        setAuthToken(response.data.accessToken);
        
        // Fetch user profile after login
        const profile = await usersApi.getProfile();
        setUser(profile);
        
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
      removeAuthToken();
    }
  };

  const value: AuthContextType = {
    user,
    userId: user?.id || null,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    logout,
    refetch: checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
