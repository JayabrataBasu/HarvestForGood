"use client";

import React, { createContext, useState, useContext, useEffect } from "react";
import { setCookie, parseCookies, destroyCookie } from "nookies";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/lib/api";

// Define the shape of the user object
interface User {
  id: string;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
}

// Define the shape of the auth context
interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: (userData: any) => Promise<any>;
  logout: () => void;
  isAuthenticated: () => boolean;
}

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Check if the user is authenticated on mount
  useEffect(() => {
    async function loadUserFromTokens() {
      try {
        const cookies = parseCookies();
        const accessToken =
          cookies.accessToken || localStorage.getItem("access_token");

        if (!accessToken) {
          setLoading(false);
          return;
        }

        const userResponse = await fetch(`${API_BASE_URL}/users/me/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (userResponse.ok) {
          const userData = await userResponse.json();
          setUser(userData);
        } else {
          // Handle token refresh if possible or clear tokens
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
        }
      } catch (err) {
        console.error("Failed to load user data:", err);
      } finally {
        setLoading(false);
      }
    }

    loadUserFromTokens();
  }, []);

  // Check if user is authenticated
  const isAuthenticated = () => {
    // For client-side usage
    if (typeof window !== "undefined") {
      const cookies = parseCookies();
      return !!(cookies.accessToken || localStorage.getItem("access_token"));
    }
    return false;
  };

  // Login function
  const login = async (email: string, password: string): Promise<void> => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/login/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
          credentials: "include",
        }
      );

      if (!response.ok) {
        let errorMessage = "Login failed";

        try {
          const errorData = await response.json();
          if (errorData.detail) {
            errorMessage = errorData.detail;
          } else if (errorData.non_field_errors) {
            errorMessage = errorData.non_field_errors.join(", ");
          }
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (e) {
          // If we can't parse the JSON, just use the status text
          errorMessage = `Login failed: ${response.statusText}`;
        }

        throw new Error(errorMessage);
      }

      const data = await response.json();

      // Set cookies for the tokens
      setCookie(null, "accessToken", data.access, {
        maxAge: 60 * 60, // 1 hour
        path: "/",
        secure: process.env.NODE_ENV !== "development",
        sameSite: "lax",
      });

      setCookie(null, "refreshToken", data.refresh, {
        maxAge: 7 * 24 * 60 * 60, // 7 days
        path: "/",
        secure: process.env.NODE_ENV !== "development",
        sameSite: "lax",
      });

      // Update user data with fetchProfile
      const userResponse = await fetch(`${API_BASE_URL}/users/me/`, {
        headers: {
          Authorization: `Bearer ${data.access}`,
        },
      });

      if (!userResponse.ok) {
        throw new Error("Failed to fetch user data");
      }

      const userData = await userResponse.json();
      setUser(userData);
    } catch (error) {
      console.error("Login error:", error);
      setError(error instanceof Error ? error.message : "Login failed");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Register function
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const register = async (userData: any) => {
    try {
      setError(null);
      setLoading(true);

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
    // Clear tokens from localStorage
    if (typeof window !== "undefined") {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
    }

    // Clear cookies
    destroyCookie(null, "accessToken");
    destroyCookie(null, "refreshToken");

    // Reset user state
    setUser(null);

    // Redirect to homepage
    router.push("/");
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
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
