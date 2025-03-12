"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useMemo,
} from "react";
import { API_BASE_URL } from "@/lib/api";
import { parseCookies, setCookie, destroyCookie } from "nookies";

interface User {
  id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  [key: string]: unknown;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  setError: (error: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Create an API instance with appropriate headers using useMemo
  const api = useMemo(
    () => ({
      get: async (url: string, options = {}) => {
        const token = localStorage.getItem("access_token");
        const response = await fetch(`${API_BASE_URL}${url}`, {
          ...options,
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(options as { headers?: Record<string, string> }).headers,
          },
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.detail || `Request failed with status ${response.status}`
          );
        }

        return response.json();
      },

      post: async (
        url: string,
        data: Record<string, unknown>,
        options: Omit<RequestInit, "headers"> & {
          headers?: Record<string, string>;
        } = {}
      ) => {
        const token = localStorage.getItem("access_token");
        const response = await fetch(`${API_BASE_URL}${url}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(options.headers || {}),
          },
          body: JSON.stringify(data),
          ...options,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.detail || `Request failed with status ${response.status}`
          );
        }

        return response.json();
      },
    }),
    []
  );

  // Check authentication on mount
  useEffect(() => {
    async function loadUser() {
      try {
        let token;

        if (typeof window !== "undefined") {
          token = localStorage.getItem("access_token");
        } else {
          const cookies = parseCookies();
          token = cookies.access_token;
        }

        if (!token) {
          setIsLoading(false);
          return;
        }

        try {
          // Try to get user data with the current token
          const response = await api.get("/users/me/");
          setUser(response);
        } catch (err) {
          console.error("Error fetching user data:", err);
          // If token might be expired, try to refresh
          const refreshToken =
            typeof window !== "undefined"
              ? localStorage.getItem("refresh_token")
              : parseCookies().refresh_token;

          if (refreshToken) {
            try {
              // Attempt to refresh the token
              const refreshResponse = await fetch(
                `${API_BASE_URL}/token/refresh/`,
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ refresh: refreshToken }),
                }
              );

              if (refreshResponse.ok) {
                const { access } = await refreshResponse.json();

                // Update tokens
                if (typeof window !== "undefined") {
                  localStorage.setItem("access_token", access);
                }
                setCookie(null, "access_token", access, {
                  maxAge: 30 * 24 * 60 * 60,
                  path: "/",
                });

                // Retry getting user data with new token
                const userResponse = await fetch(`${API_BASE_URL}/users/me/`, {
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${access}`,
                  },
                });

                if (userResponse.ok) {
                  const userData = await userResponse.json();
                  setUser(userData);
                } else {
                  throw new Error(
                    "Failed to get user data after token refresh"
                  );
                }
              } else {
                throw new Error("Token refresh failed");
              }
            } catch (refreshError) {
              console.error("Token refresh failed:", refreshError);
              // Clear auth data on refresh failure
              logout();
            }
          } else {
            // No refresh token, clear auth data
            logout();
          }
        }
      } catch (err) {
        console.error("Failed to load user:", err);
        // Clear tokens if authentication fails
        logout();
      } finally {
        setIsLoading(false);
      }
    }

    loadUser();
  }, [api]);

  // Login function - works with Django REST Framework's token auth
  const login = async (
    username: string,
    password: string
  ): Promise<boolean> => {
    try {
      setError(null);
      setIsLoading(true);

      // For Django REST Framework JWT or token auth
      const response = await fetch(`${API_BASE_URL}/token/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || "Invalid credentials");
      }

      const { access, refresh } = await response.json();

      // Store tokens in localStorage for client-side access
      localStorage.setItem("access_token", access);
      localStorage.setItem("refresh_token", refresh);

      // Set cookies for server-side access
      setCookie(null, "access_token", access, {
        maxAge: 30 * 24 * 60 * 60,
        path: "/",
      });
      setCookie(null, "refresh_token", refresh, {
        maxAge: 30 * 24 * 60 * 60,
        path: "/",
      });

      // Get user data
      const userResponse = await api.get("/users/me/");
      setUser(userResponse);

      return true;
    } catch (err: unknown) {
      setError((err as Error).message || "Login failed");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    // Clear tokens from localStorage
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");

    // Clear cookies
    destroyCookie(null, "access_token");
    destroyCookie(null, "refresh_token");

    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    logout,
    setError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
