import React, { useState, useEffect } from "react";
import api from "../utils/api";
import API_CONFIG from "../config/api";

const TestConnection = () => {
  const [status, setStatus] = useState("Testing connection...");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    setLoading(true);
    try {
      console.log("Testing connection to:", API_CONFIG.BASE_URL);

      const response = await api.get(API_CONFIG.ENDPOINTS.FORUM_POSTS);
      const count = response.data.results?.length || response.data.length || 0;

      setStatus(`✅ Backend Connected! Found ${count} forum posts`);
      console.log("API Response:", response.data);
    } catch (error) {
      console.error("Connection Error:", error);
      setStatus(
        `❌ Connection failed: ${
          error.response?.data?.detail || error.message
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "8px",
        margin: "20px",
        backgroundColor: loading
          ? "#fff3cd"
          : status.includes("✅")
          ? "#d4edda"
          : "#f8d7da",
      }}
    >
      <h3>🔗 Backend Connection Test</h3>
      <p>
        <strong>Backend:</strong> https://harvestforgood-production.up.railway.app
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
        {loading ? "🔄 Testing..." : status}
      </div>

      <button
        onClick={testConnection}
        disabled={loading}
        style={{
          padding: "8px 16px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Testing..." : "Test Connection Again"}
      </button>
    </div>
  );
};

export default TestConnection;
        }}
      >
        {loading ? "🔄 Testing..." : status}
      </div>

      <button
        onClick={testEndpoints}
        disabled={loading}
        style={{
          padding: "8px 16px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Testing..." : "Test All Endpoints"}
      </button>
    </div>
  );
};

export default TestConnection;
