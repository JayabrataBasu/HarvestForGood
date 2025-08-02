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
  // Ensure proper URL formatting
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 
            (process.env.NODE_ENV === 'production' 
              ? 'https://harvestforgood-production.up.railway.app/api/' 
              : 'http://localhost:8000/api/'),
  
  TIMEOUT: 30000, // Increased timeout
  
  AUTH: {
    LOGIN: 'auth/login/',
    REGISTER: 'auth/registration/', 
    LOGOUT: 'auth/logout/',
    USER: 'auth/user/',
    REFRESH: 'token/refresh/',
  },
  
  ENDPOINTS: {
    FORUM_POSTS: 'forum/posts/',
    RESEARCH_PAPERS: 'research/papers/',
    USERS: 'users/',
  }
};

// Debug logging
console.log('API Configuration:', {
  BASE_URL: API_CONFIG.BASE_URL,
  NODE_ENV: process.env.NODE_ENV,
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL
});

export default API_CONFIG;
export type { APIConfig, AuthEndpoints, APIEndpoints };
