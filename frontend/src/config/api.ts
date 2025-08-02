interface AuthEndpoints {
  LOGIN: string;
  REGISTER: string;
  LOGOUT: string;
  USER: string;
  REFRESH: string;
}

interface APIEndpoints {
  FORUM_POSTS: string;
  RESEARCH_PAPERS: string;
  USERS: string;
}

interface APIConfig {
  BASE_URL: string;
  TIMEOUT: number;
  AUTH: AuthEndpoints;
  ENDPOINTS: APIEndpoints;
}

const API_CONFIG: APIConfig = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 
            (process.env.NODE_ENV === 'production' 
              ? 'https://harvestforgood-production.up.railway.app/api/' 
              : 'http://localhost:8000/api/'),
  
  TIMEOUT: 30000,

  AUTH: {
    LOGIN: 'auth/login/',
    REGISTER: 'auth/registration/', // Changed to match Django allauth
    LOGOUT: 'auth/logout/',
    USER: 'auth/user/',
    REFRESH: 'token/refresh/', // Changed to match your JWT setup
  },
  
  ENDPOINTS: {
    FORUM_POSTS: 'forum/posts/', // Changed back to singular 'forum'
    RESEARCH_PAPERS: 'research/papers/',
    USERS: 'users/',
  }
};

export default API_CONFIG;
export type { APIConfig, AuthEndpoints, APIEndpoints };

console.log('API Configuration:', {
  BASE_URL: API_CONFIG.BASE_URL,
  NODE_ENV: process.env.NODE_ENV,
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL
});
