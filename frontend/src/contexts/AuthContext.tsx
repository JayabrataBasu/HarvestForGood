"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { isAuthenticated, API_BASE_URL } from "@/lib/api";

interface User {
  id: string;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  setUser: () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load user data if authenticated
    const loadUserData = async () => {
      if (isAuthenticated()) {
        try {
          const token = localStorage.getItem("access_token");
          const response = await fetch(`${API_BASE_URL}/users/me/`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
          } else {
            // If token is invalid, clear it
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
          }
        } catch (error) {
          console.error("Error loading user data:", error);
        }
      }

      setIsLoading(false);
    };

    loadUserData();
  }, []);

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setUser(null);

    // Redirect to home page after logout
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
