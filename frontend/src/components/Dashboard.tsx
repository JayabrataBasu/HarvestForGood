import React from "react";
import TestConnection from "./TestConnection";
import ForumPostsList from "./ForumPostsList";

const Dashboard: React.FC = () => {
  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
      <h1 style={{ textAlign: "center", marginBottom: "30px" }}>
        🌱 Harvest For Good Dashboard
      </h1>

      <TestConnection />
      <ForumPostsList />

      <div
        style={{
          marginTop: "40px",
          padding: "20px",
          backgroundColor: "#e8f5e8",
          borderRadius: "8px",
          border: "1px solid #4caf50",
        }}
      >
        <h3>✅ Frontend-Backend Connection Status</h3>
        <p>
          <strong>Frontend:</strong> https://harvestforgood.vercel.app
        </p>
        <p>
          <strong>Backend:</strong>{" "}
          https://harvestforgood-production.up.railway.app
        </p>
        <p>
          <strong>API Base:</strong>{" "}
          https://harvestforgood-production.up.railway.app/api/
        </p>
        <p>🔗 Connection established successfully!</p>
      </div>
    </div>
  );
};

export default Dashboard;
