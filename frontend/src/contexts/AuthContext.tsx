"use client";

import React, { createContext, useState, useEffect, useContext } from "react";
import { API_BASE_URL } from "@/lib/api"; // Use alias import
import { useRouter } from "next/navigation";
import { parseCookies, setCookie, destroyCookie } from "nookies";

// Define types for TypeScript
interface User {
  id: number;
  username?: string;
  email: string;
  first_name?: string;
  last_name?: string;
  role?: string;
  is_active?: boolean;
  date_joined?: string;
  [key: string]: string | number | boolean | undefined;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: (userData: any) => Promise<any>; // Changed from string to any
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Check if user is authenticated on load
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
          setLoading(false);
          return;
        }

        // Update the API endpoint to use the correct path
        const response = await fetch(`${API_BASE_URL}/users/me/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to load user: ${response.status}`);
        }

        const userData = await response.json();
        setUser(userData);
      } catch (err) {
        console.error("Failed to load user:", err);
        // Clear tokens if authentication fails
        if (typeof window !== "undefined") {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
        }
        // Also clear cookies
        destroyCookie(null, "access_token");
        destroyCookie(null, "refresh_token");
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setError(null);

      // Try with username field instead of email (many Django backends expect username)
      // Some backends might expect 'username' instead of 'email'
      const response = await fetch(`${API_BASE_URL}/token/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: email, // Try with username field
          email: email, // Also include email field
          password,
        }),
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Login failed");
      }

      const { access, refresh } = await response.json();

      // Store in both localStorage and cookies
      if (typeof window !== "undefined") {
        localStorage.setItem("access_token", access);
        localStorage.setItem("refresh_token", refresh);
      }

      // Set cookies for server-side access
      setCookie(null, "access_token", access, {
        maxAge: 30 * 24 * 60 * 60,
        path: "/",
        sameSite: "lax",
      });
      setCookie(null, "refresh_token", refresh, {
        maxAge: 30 * 24 * 60 * 60,
        path: "/",
        sameSite: "lax",
      });

      // Get user data
      const userResponse = await fetch(`${API_BASE_URL}/users/me/`, {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      });

      if (!userResponse.ok) {
        throw new Error("Failed to fetch user data");
      }

      const userData = await userResponse.json();
      setUser(userData);

      return true;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "Login failed");
      throw err;
    }
  };

  // Register function
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const register = async (userData: any) => {
    try {
      setError(null);
      setLoading(true);

      // Use our API endpoint for registration
      const response = await fetch(`${API_BASE_URL}/users/register/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage =
          errorData.detail ||
          errorData.email?.[0] ||
          errorData.password?.[0] ||
          "Registration failed";
        throw new Error(errorMessage);
      }

      const data = await response.json();

      // Some implementations might return tokens on registration
      // But usually registration just creates the account and requires email verification
      return data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Registration error:", err);
      setError(err.message || "Registration failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
    }

    // Clear cookies as well
    destroyCookie(null, "access_token");
    destroyCookie(null, "refresh_token");

    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
