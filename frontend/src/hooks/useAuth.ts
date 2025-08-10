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
  login: (credentials: { email: string; password: string }) => Promise<void>;
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
      const token = localStorage.getItem('authToken');
      if (token) {
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

  const login = async (credentials: { email: string; password: string }) => {
    setIsLoading(true);
    try {
      // Use email for login
      const response = await fetch('/api/token/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      if (response.ok) {
        const { access, refresh } = await response.json();
        localStorage.setItem('access_token', access);
        localStorage.setItem('refresh_token', refresh);

        // Fetch user info after login
        const userResponse = await fetch('/api/users/me/', {
          headers: { 'Authorization': `Bearer ${access}` },
        });
        if (userResponse.ok) {
          const userData = await userResponse.json();
          setUser({
            id: userData.id,
            username: userData.username || '',
            email: userData.email,
            isSuperuser: userData.is_superuser || false,
            isAuthenticated: true,
          });
        } else {
          setUser(null);
        }
      } else {
        const err = await response.json();
        throw new Error(err.detail || 'Login failed');
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
  const response = await fetch('/api/users/me/', {
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
    isSuperuser: userData.is_superuser || false,
    isAuthenticated: true,
  };
}
