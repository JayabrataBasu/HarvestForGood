const API_CONFIG = {
  BASE_URL: process.env.NODE_ENV === 'production' 
    ? 'https://YOUR-ACTUAL-RAILWAY-URL.up.railway.app/api/' // Replace with real URL
    : 'http://localhost:8000/api/',
  
  TIMEOUT: 10000,
  
  AUTH: {
    LOGIN: 'auth/login/',
    REGISTER: 'auth/registration/',
    LOGOUT: 'auth/logout/',
    USER: 'auth/user/',
  },
  
  ENDPOINTS: {
    FORUM_POSTS: 'forum/posts/',
    RESEARCH_PAPERS: 'research/papers/',
  }
};

export default API_CONFIG;
