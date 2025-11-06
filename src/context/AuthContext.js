import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../utils/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('innerwhispers_token');
      const storedUser = localStorage.getItem('innerwhispers_user');

      if (token && storedUser) {
        try {
          // Verify token is still valid by fetching current user
          const userData = await authAPI.getCurrentUser();
          setUser(userData);
          localStorage.setItem('innerwhispers_user', JSON.stringify(userData));
        } catch (err) {
          // Token invalid or expired - clear storage
          console.error('Token validation failed:', err);
          localStorage.removeItem('innerwhispers_token');
          localStorage.removeItem('innerwhispers_user');
          setUser(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const signup = async (email, password, username, fullName = '') => {
    try {
      setError(null);
      const response = await authAPI.signup(email, password, username, fullName);
      
      // Store token and user data
      localStorage.setItem('innerwhispers_token', response.access_token);
      localStorage.setItem('innerwhispers_user', JSON.stringify(response.user));
      setUser(response.user);
      
      return { success: true, user: response.user };
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Signup failed. Please try again.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const login = async (email, password) => {
    try {
      setError(null);
      const response = await authAPI.login(email, password);
      
      console.log('[AUTH DEBUG] Login response:', response);
      console.log('[AUTH DEBUG] Access token:', response.access_token?.substring(0, 20) + '...');
      
      // Store token and user data
      localStorage.setItem('innerwhispers_token', response.access_token);
      localStorage.setItem('innerwhispers_user', JSON.stringify(response.user));
      setUser(response.user);
      
      console.log('[AUTH DEBUG] User set in context:', response.user.username);
      console.log('[AUTH DEBUG] Token stored in localStorage');
      
      return { success: true, user: response.user };
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Login failed. Please check your credentials.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      // Clear local storage and state regardless of API call result
      localStorage.removeItem('innerwhispers_token');
      localStorage.removeItem('innerwhispers_user');
      setUser(null);
      setError(null);
    }
  };

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('innerwhispers_user', JSON.stringify(userData));
  };

  const value = {
    user,
    loading,
    error,
    signup,
    login,
    logout,
    updateUser,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
