import api from '../utils/api';
import API_CONFIG from '../config/api';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password1: string;
  password2: string;
  first_name?: string;
  last_name?: string;
}

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  is_verified: boolean;
}

interface LoginResponse {
  access: string;
  refresh: string;
  user: User;
}

export const authService = {
  // Login user
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>(API_CONFIG.AUTH.LOGIN, credentials);
    const { access, refresh, user } = response.data;
    
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
    localStorage.setItem('user', JSON.stringify(user));
    
    return response.data;
  },

  // Register user
  register: async (userData: RegisterData) => {
    const response = await api.post(API_CONFIG.AUTH.REGISTER, userData);
    return response.data;
  },

  // Logout user
  logout: async (): Promise<void> => {
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
  getCurrentUser: (): User | null => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('access_token');
  },
};

export type { LoginCredentials, RegisterData, User, LoginResponse };
