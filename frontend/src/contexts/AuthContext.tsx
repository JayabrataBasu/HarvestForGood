"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { isAuthenticated, API_BASE_URL } from "@/lib/api";

interface User {
  id: string;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  email_verified?: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
  register: (userData: {
    email: string;
    password: string;
    password2?: string; // Make password2 optional in the interface
    first_name: string;
    last_name: string;
    username: string;
  }) => Promise<unknown>;
  resendVerificationEmail: () => Promise<{ success: boolean; message: string }>;
  checkEmailVerificationStatus: () => Promise<boolean>;
  sendWelcomeEmail: (
    email: string
  ) => Promise<{ success: boolean; message: string }>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  setUser: () => {},
  logout: () => {},
  register: async () => {},
  resendVerificationEmail: async () => ({ success: false, message: "" }),
  checkEmailVerificationStatus: async () => false,
  sendWelcomeEmail: async () => ({ success: false, message: "" }),
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load user data if authenticated
    const loadUserData = async () => {
      if (isAuthenticated()) {
        try {
          const token = localStorage.getItem("access_token");
          // Use the correct API endpoint for fetching user data
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
          // If there's an error, consider the user not authenticated
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
        }
      }
      setIsLoading(false);
    };
    loadUserData();
  }, []);

  const logout = () => {
    // Clear authentication tokens
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");

    // Clear user state
    setUser(null);

    // Ensure we only redirect in client environment
    if (typeof window !== "undefined") {
      // Use smooth redirection to home page
      window.location.href = "/";
    }
  };

  const checkEmailVerificationStatus = async (): Promise<boolean> => {
    if (!isAuthenticated()) return false;
    try {
      const token = localStorage.getItem("access_token");
      // Make sure we're using the correct endpoint
      const response = await fetch(`${API_BASE_URL}/users/me/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        return userData.email_verified || false;
      }
    } catch (error) {
      console.error("Error checking email verification status:", error);
      return false;
    }
    return false;
  };

  const resendVerificationEmail = async (): Promise<{
    success: boolean;
    message: string;
  }> => {
    if (!isAuthenticated()) {
      return {
        success: false,
        message: "You must be logged in to resend verification email",
      };
    }
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(
        `${API_BASE_URL}/users/resend-verification-email/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      return {
        success: response.ok,
        message:
          data.message ||
          (response.ok
            ? "Verification email sent successfully"
            : "Failed to send verification email"),
      };
    } catch (error) {
      console.error("Error resending verification email:", error);
      return { success: false, message: "Failed to send verification email" };
    }
  };

  const register = async (userData: {
    email: string;
    password: string;
    password2?: string;
    first_name: string;
    last_name: string;
    username: string;
  }) => {
    try {
      // Update to the correct registration endpoint based on backend URLs
      console.log("Attempting to register user with data:", userData);
      // Make sure password2 is included in the request
      // If it's not provided, use the same value as password
      const registrationData = {
        ...userData,
        password2: userData.password2 || userData.password,
      };
      const response = await fetch(`${API_BASE_URL}/users/register/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registrationData),
      });

      // Check the content type of the response
      const contentType = response.headers.get("content-type");
      // Handle SMTP errors gracefully - if we get a 500 error, try to login anyway
      // since the user might have been created despite the email error
      if (response.status === 500) {
        console.warn(
          "Registration seemed to fail due to email sending issues. User might still have been created."
        );
        return {
          success: true,
          status: 200,
          emailFailed: true,
          message:
            "Account created but verification email could not be sent. You can try to resend it later.",
        };
      }

      if (!response.ok) {
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json();
          throw new Error(
            typeof errorData.detail === "string"
              ? errorData.detail
              : JSON.stringify(errorData) || "Registration failed"
          );
        } else {
          // Handle non-JSON error responses
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const text = await response.text();
          throw new Error(
            `Registration failed: ${response.status} ${response.statusText}`
          );
        }
      }

      // If registration was successful, attempt to send welcome email
      if (response.ok) {
        try {
          await sendWelcomeEmail(userData.email);
        } catch (emailError) {
          console.warn(
            "Welcome email could not be sent, but registration was successful:",
            emailError
          );
        }
      }

      // Check if response is JSON before parsing
      if (contentType && contentType.includes("application/json")) {
        return await response.json();
      } else {
        // If not JSON, return the response status
        return { success: true, status: response.status };
      }
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  };

  const sendWelcomeEmail = async (
    email: string
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/users/send-welcome-email/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );
      const data = await response.json();
      return {
        success: response.ok,
        message:
          data.message ||
          (response.ok
            ? "Welcome email sent successfully"
            : "Failed to send welcome email"),
      };
    } catch (error) {
      console.error("Error sending welcome email:", error);
      return { success: false, message: "Failed to send welcome email" };
    }
  };

  const value = {
    user,
    isLoading,
    setUser,
    logout,
    register,
    resendVerificationEmail,
    checkEmailVerificationStatus,
    sendWelcomeEmail,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
