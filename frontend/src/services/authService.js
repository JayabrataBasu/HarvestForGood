import api from '../utils/api';
import API_CONFIG from '../config/api';

export const authService = {
  // Login user
  login: async (credentials) => {
    const response = await api.post(API_CONFIG.AUTH.LOGIN, credentials);
    const { access, refresh, user } = response.data;
    
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
    localStorage.setItem('user', JSON.stringify(user));
    
    return response.data;
  },

  // Register user
  register: async (userData) => {
    const response = await api.post(API_CONFIG.AUTH.REGISTER, userData);
    return response.data;
  },

  // Logout user
  logout: async () => {
    try {
      await api.post(API_CONFIG.AUTH.LOGOUT);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
    }
  },

  // Get current user
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('access_token');
  },
};
