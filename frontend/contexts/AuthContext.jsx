import React, { createContext, useState, useEffect, useContext } from "react";
import api from "../src/services/api";
import { useRouter } from "next/router";
import { parseCookies, setCookie, destroyCookie } from "nookies";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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

        const response = await api.get("/api/users/me/");
        setUser(response.data);
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
  const login = async (email, password) => {
    try {
      setError(null);
      const response = await api.post("/api/token/", { email, password });
      const { access, refresh } = response.data;

      // Store in both localStorage and cookies
      if (typeof window !== "undefined") {
        localStorage.setItem("access_token", access);
        localStorage.setItem("refresh_token", refresh);
      }

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
      const userResponse = await api.get("/api/users/me/");
      setUser(userResponse.data);

      return true;
    } catch (err) {
      setError(err.response?.data?.detail || "Login failed");
      throw err;
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      setError(null);
      const response = await api.post("/api/users/register/", userData);

      // Some implementations might return tokens on registration
      if (response.data.access) {
        localStorage.setItem("access_token", response.data.access);
        localStorage.setItem("refresh_token", response.data.refresh);
        setUser(response.data.user);
      }

      return response.data;
    } catch (err) {
      setError(err.response?.data || "Registration failed");
      throw err;
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

export const useAuth = () => useContext(AuthContext);
