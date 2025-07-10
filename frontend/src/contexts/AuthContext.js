import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import jwt_decode from 'jwt-decode';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          // Check if token is expired
          const decodedToken = jwt_decode(token);
          const currentTime = Date.now() / 1000;
          
          if (decodedToken.exp < currentTime) {
            // Token is expired
            logout();
          } else {
            // Set auth header for all requests
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            
            // Get user data
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/auth/me`);
            setUser(response.data.data);
            setIsAuthenticated(true);
          }
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    try {
      setError(null);
      setIsLoading(true);
      
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/login`, {
        email,
        password,
      });
      
      const { token, user } = response.data.data;
      
      // Save token to localStorage
      localStorage.setItem('token', token);
      
      // Set auth header for all requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setUser(user);
      setIsAuthenticated(true);
      
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during login');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      setIsLoading(true);
      
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/register`, userData);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during registration');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    setIsAuthenticated(false);
  };

  const verifyEmail = async (token) => {
    try {
      setError(null);
      setIsLoading(true);
      
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/auth/verify-email/${token}`);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during email verification');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const forgotPassword = async (email) => {
    try {
      setError(null);
      setIsLoading(true);
      
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/forgot-password`, { email });
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during password reset request');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (token, password, passwordConfirm) => {
    try {
      setError(null);
      setIsLoading(true);
      
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/reset-password/${token}`, {
        password,
        passwordConfirm,
      });
      
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during password reset');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (userData) => {
    try {
      setError(null);
      setIsLoading(true);
      
      const response = await axios.patch(`${process.env.REACT_APP_API_URL}/api/users/profile`, userData);
      setUser(response.data.data);
      
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while updating profile');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updatePassword = async (currentPassword, newPassword, newPasswordConfirm) => {
    try {
      setError(null);
      setIsLoading(true);
      
      const response = await axios.patch(`${process.env.REACT_APP_API_URL}/api/auth/update-password`, {
        currentPassword,
        newPassword,
        newPasswordConfirm,
      });
      
      // Update token
      const { token } = response.data.data;
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while updating password');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    verifyEmail,
    forgotPassword,
    resetPassword,
    updateProfile,
    updatePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};