import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import ApiService from '../services/api';
import OAuthService from '../services/oauthService';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  fullName: string;
  healthProfile?: {
    age?: number;
    height?: number;
    weight?: number;
    activityLevel?: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
    goals?: string[];
  };
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (firstName: string, lastName: string, email: string, password: string) => Promise<void>;
  createAccount: (firstName: string, lastName: string, email: string, password: string) => Promise<void>;
  loginWithGoogle: (credential: string, clientId: string) => Promise<void>;
  loginWithApple: (identityToken: string, user?: any) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in on app start
    const initializeAuth = async () => {
      try {
        if (ApiService.isAuthenticated()) {
          const storedUser = ApiService.getCurrentUserFromStorage();
          if (storedUser) {
            setUser(storedUser);
          } else {
            // Verify token is still valid
            const response = await ApiService.getCurrentUser();
            if (response.success) {
              setUser(response.user);
            } else {
              ApiService.logout();
            }
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        ApiService.logout();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await ApiService.login({ email, password });
    if (response.success && response.user) {
      setUser(response.user);
    } else {
      throw new Error(response.message || 'Login failed');
    }
  };

  const signup = async (firstName: string, lastName: string, email: string, password: string) => {
    const response = await ApiService.signup({ firstName, lastName, email, password });
    if (response.success && response.user) {
      setUser(response.user);
    } else {
      throw new Error(response.message || 'Signup failed');
    }
  };

  const createAccount = async (firstName: string, lastName: string, email: string, password: string) => {
    // Create account without auto-login
    const response = await ApiService.signup({ firstName, lastName, email, password });
    if (response.success) {
      // Don't set user state - just return success
      // Clear any tokens that might have been stored
      ApiService.logout();
    } else {
      throw new Error(response.message || 'Account creation failed');
    }
  };

  const logout = () => {
    ApiService.logout();
    setUser(null);
  };

  const loginWithGoogle = async (credential: string, clientId: string) => {
    const response = await OAuthService.googleSignIn(credential, clientId);
    if (response.success && response.user) {
      setUser(response.user);
    } else {
      throw new Error(response.message || 'Google sign-in failed');
    }
  };

  const loginWithApple = async (identityToken: string, user?: any) => {
    const response = await OAuthService.appleSignIn(identityToken, user);
    if (response.success && response.user) {
      setUser(response.user);
    } else {
      throw new Error(response.message || 'Apple sign-in failed');
    }
  };

  const refreshUser = async () => {
    try {
      if (ApiService.isAuthenticated()) {
        const response = await ApiService.getCurrentUser();
        if (response.success && response.user) {
          setUser(response.user);
        }
      }
    } catch (error) {
      console.error('Error refreshing user data:', error);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    createAccount,
    loginWithGoogle,
    loginWithApple,
    logout,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};