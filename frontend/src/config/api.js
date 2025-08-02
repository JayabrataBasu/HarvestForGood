const API_CONFIG = {
  // Use environment variable or fallback to hardcoded URLs
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 
            (process.env.NODE_ENV === 'production' 
              ? 'https://harvestforgood-production.up.railway.app/api/' 
              : 'http://localhost:8000/api/'),
  
  TIMEOUT: 10000,
  
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
    COMMENTS: 'forum/comments/',
  }
};

export default API_CONFIG;


