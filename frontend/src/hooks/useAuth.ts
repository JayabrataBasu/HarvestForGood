import { useState, useEffect, createContext, useContext } from 'react';

export interface User {
  id: string;
  username: string;
  email: string;
  isSuperuser: boolean;
  isAuthenticated: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (credentials: { username: string; password: string }) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    // Fallback for when used outside provider
    return {
      user: null,
      login: async () => {},
      logout: () => {},
      isLoading: false,
    };
  }
  return context;
}

// Hook for managing auth state
export function useAuthState() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // Replace with your actual auth check API call
      const token = localStorage.getItem('authToken');
      if (token) {
        // Validate token and get user data
        // This is a placeholder - implement your actual auth verification
        const userData = await verifyToken(token);
        setUser(userData);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('authToken');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: { username: string; password: string }) => {
    setIsLoading(true);
    try {
      // Replace with your actual login API call
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      
      if (response.ok) {
        const { token, user: userData } = await response.json();
        localStorage.setItem('authToken', token);
        setUser(userData);
      } else {
        throw new Error('Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
  };

  return {
    user,
    login,
    logout,
    isLoading,
  };
}

// Placeholder function - replace with your actual token verification
async function verifyToken(token: string): Promise<User> {
  // This should make an actual API call to verify the token
  const response = await fetch('/api/auth/verify', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Token verification failed');
  }

  const userData = await response.json();
  return {
    id: userData.id || '1',
    username: userData.username || 'user',
    email: userData.email || 'user@example.com',
    isSuperuser: userData.isSuperuser || false,
    isAuthenticated: true,
  };
}
