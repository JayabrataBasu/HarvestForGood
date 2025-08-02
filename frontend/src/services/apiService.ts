import api from '../utils/api';
import API_CONFIG from '../config/api';
import { ForumPost, ResearchPaper, PaginatedResponse } from '../types/api';

export const apiService = {
  // Forum Posts
  forumPosts: {
    getAll: () => api.get<PaginatedResponse<ForumPost>>(API_CONFIG.ENDPOINTS.FORUM_POSTS),
    getById: (id: number) => api.get<ForumPost>(`${API_CONFIG.ENDPOINTS.FORUM_POSTS}${id}/`),
    create: (data: Partial<ForumPost>) => api.post<ForumPost>(API_CONFIG.ENDPOINTS.FORUM_POSTS, data),
    update: (id: number, data: Partial<ForumPost>) => api.put<ForumPost>(`${API_CONFIG.ENDPOINTS.FORUM_POSTS}${id}/`, data),
    delete: (id: number) => api.delete(`${API_CONFIG.ENDPOINTS.FORUM_POSTS}${id}/`),
  },

  // Research Papers
  researchPapers: {
    getAll: () => api.get<PaginatedResponse<ResearchPaper>>(API_CONFIG.ENDPOINTS.RESEARCH_PAPERS),
    getById: (id: number) => api.get<ResearchPaper>(`${API_CONFIG.ENDPOINTS.RESEARCH_PAPERS}${id}/`),
    create: (data: Partial<ResearchPaper>) => api.post<ResearchPaper>(API_CONFIG.ENDPOINTS.RESEARCH_PAPERS, data),
    update: (id: number, data: Partial<ResearchPaper>) => api.put<ResearchPaper>(`${API_CONFIG.ENDPOINTS.RESEARCH_PAPERS}${id}/`, data),
    delete: (id: number) => api.delete(`${API_CONFIG.ENDPOINTS.RESEARCH_PAPERS}${id}/`),
  },

  // Users
  users: {
    getProfile: () => api.get(API_CONFIG.AUTH.USER),
    updateProfile: (data: Partial<{ name?: string; email?: string; password?: string }>) => api.put(API_CONFIG.AUTH.USER, data),
  },

  // Test connection
  testConnection: () => api.get(API_CONFIG.ENDPOINTS.FORUM_POSTS),
};
