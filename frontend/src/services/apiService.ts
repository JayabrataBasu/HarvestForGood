import api from '../utils/api';
import API_CONFIG from '../config/api';
import { ResearchPaper } from '../types/paper.types';
import { LoginCredentials, RegisterData, User } from '../types/auth.types';

export const apiService = {
  // Forum Posts
  getForumPosts: () => api.get(`${API_CONFIG.ENDPOINTS.FORUM_POSTS}`),
  getForumPost: (id: number) => api.get(`${API_CONFIG.ENDPOINTS.FORUM_POSTS}${id}/`),
  createForumPost: (data: { title: string; content: string; authorId: number }) => api.post(`${API_CONFIG.ENDPOINTS.FORUM_POSTS}`, data),

  // Research Papers
  researchPapers: {
    getAll: () => api.get(`${API_CONFIG.ENDPOINTS.RESEARCH_PAPERS}`),
    get: (id: number) => api.get(`${API_CONFIG.ENDPOINTS.RESEARCH_PAPERS}${id}/`),
    update: (id: number, data: Partial<ResearchPaper>) => api.put<ResearchPaper>(`${API_CONFIG.ENDPOINTS.RESEARCH_PAPERS}${id}/`, data),
    delete: (id: number) => api.delete(`${API_CONFIG.ENDPOINTS.RESEARCH_PAPERS}${id}/`),
  },

  // Authentication
  login: (credentials: LoginCredentials) => api.post(`${API_CONFIG.AUTH.LOGIN}`, credentials),
  register: (userData: RegisterData) => api.post(`${API_CONFIG.AUTH.REGISTER}`, userData),
  logout: () => api.post(`${API_CONFIG.AUTH.LOGOUT}`),
  getCurrentUser: () => api.get(`${API_CONFIG.AUTH.USER}`),

  // Users
  users: {
    getProfile: () => api.get(API_CONFIG.AUTH.USER),
    updateProfile: (data: Partial<User>) => api.put(API_CONFIG.AUTH.USER, data),
  },

  // Test connection
  testConnection: () => api.get(API_CONFIG.ENDPOINTS.FORUM_POSTS),
};
