import React, { useState, useEffect } from "react";
import api from "../utils/api";
import API_CONFIG from "../config/api";

interface ConnectionStatus {
  message: string;
  isLoading: boolean;
  isSuccess: boolean;
}

const TestConnection: React.FC = () => {
  const [status, setStatus] = useState<ConnectionStatus>({
    message: "Testing connection...",
    isLoading: true,
    isSuccess: false,
  });

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async (): Promise<void> => {
    setStatus({
      message: "Testing connection...",
      isLoading: true,
      isSuccess: false,
    });

    try {
      console.log("Testing connection to:", API_CONFIG.BASE_URL);

      const response = await api.get(API_CONFIG.ENDPOINTS.FORUM_POSTS);
      const count = response.data.results?.length || response.data.length || 0;

      setStatus({
        message: `✅ Backend Connected! Found ${count} forum posts`,
        isLoading: false,
        isSuccess: true,
      });
      console.log("API Response:", response.data);
    } catch (error: unknown) {
      console.error("Connection Error:", error);
      let errorMessage = "Unknown error";
      interface ApiError {
        response?: {
          data?: {
            detail?: string;
          };
        };
        message?: string;
      }

      if (typeof error === "object" && error !== null) {
        const apiError = error as ApiError;
        if (
          apiError.response &&
          typeof apiError.response.data?.detail === "string"
        ) {
          errorMessage = apiError.response.data.detail;
        } else if (typeof apiError.message === "string") {
          errorMessage = apiError.message;
        }
      }
      setStatus({
        message: `❌ Connection failed: ${errorMessage}`,
        isLoading: false,
        isSuccess: false,
      });
    }
  };

  const getStatusColor = (): string => {
    if (status.isLoading) return "#fff3cd";
    return status.isSuccess ? "#d4edda" : "#f8d7da";
  };

  return (
    <div
      style={{
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "8px",
        margin: "20px",
        backgroundColor: getStatusColor(),
      }}
    >
      <h3>🔗 Backend Connection Test</h3>
      <p>
        <strong>Backend:</strong>{" "}
        https://harvestforgood-production.up.railway.app
      </p>
      <p>
        <strong>Frontend:</strong> https://harvestforgood.vercel.app
      </p>

      <div
        style={{
          padding: "10px",
          backgroundColor: "white",
          border: "1px solid #ccc",
          borderRadius: "4px",
          marginBottom: "10px",
          fontFamily: "monospace",
        }}
      >
        {status.isLoading ? "🔄 Testing..." : status.message}
      </div>

      <button
        onClick={testConnection}
        disabled={status.isLoading}
        style={{
          padding: "8px 16px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: status.isLoading ? "not-allowed" : "pointer",
          opacity: status.isLoading ? 0.7 : 1,
        }}
      >
        {status.isLoading ? "Testing..." : "Test Connection Again"}
      </button>
    </div>
  );
};

export default TestConnection;
