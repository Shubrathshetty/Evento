import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { api, tokenManager, ApiError } from '@/lib/api';
import type { User, TokenResponse, LoginRequest, SignupRequest } from '@/types/api';

type AppRole = 'admin' | 'user';

interface AuthContextType {
  user: User | null;
  role: AppRole | null;
  loading: boolean;
  isAuthenticated: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateProfile: (name: string, email: string) => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const role = user?.role ?? null;
  const isAuthenticated = !!user;

  // Fetch current user from /api/auth/me
  const fetchCurrentUser = useCallback(async () => {
    const token = tokenManager.getAccessToken();
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const userData = await api.get<User>('/api/auth/me');
      setUser(userData);
    } catch (error) {
      // Token invalid or expired
      if (error instanceof ApiError && error.status === 401) {
        tokenManager.clearTokens();
      }
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Check auth on mount
  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const signupData: SignupRequest = {
        email,
        password,
        name: fullName,
      };

      // Register the user
      await api.post<User>('/api/auth/signup', signupData);

      // Auto-login after signup
      const loginData: LoginRequest = { email, password };
      const tokens = await api.post<TokenResponse>('/api/auth/login', loginData);
      tokenManager.setTokens(tokens.access_token, tokens.refresh_token);

      // Fetch user data
      await fetchCurrentUser();

      return { error: null };
    } catch (error) {
      const apiError = error as ApiError;
      const message =
        typeof (apiError.data as any)?.detail === 'string'
          ? (apiError.data as any).detail
          : Array.isArray((apiError.data as any)?.detail)
            ? (apiError.data as any).detail[0].msg
            : 'Signup failed';

      console.error("Signup Error Details:", apiError);
      return { error: new Error(message) };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const loginData: LoginRequest = { email, password };
      const tokens = await api.post<TokenResponse>('/api/auth/login', loginData);

      tokenManager.setTokens(tokens.access_token, tokens.refresh_token);

      // Fetch user data
      await fetchCurrentUser();

      return { error: null };
    } catch (error) {
      const apiError = error as ApiError;
      const message = (apiError.data as { detail?: string })?.detail || 'Login failed';
      return { error: new Error(message) };
    }
  };

  const updateProfile = async (name: string, email: string) => {
    try {
      const updatedUser = await api.put<User>('/api/auth/me', { name, email });
      setUser(updatedUser);
      return { error: null };
    } catch (error) {
      const apiError = error as ApiError;
      const message = (apiError.data as { detail?: string })?.detail || 'Update failed';
      return { error: new Error(message) };
    }
  };

  const signOut = async () => {
    tokenManager.clearTokens();
    setUser(null);
  };

  const refreshUser = async () => {
    await fetchCurrentUser();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        loading,
        isAuthenticated,
        signUp,
        signIn,
        signOut,
        refreshUser,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
