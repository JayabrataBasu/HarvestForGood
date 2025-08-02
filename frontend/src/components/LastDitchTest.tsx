import React, { useEffect, useState } from "react";

const LastDitchTest: React.FC = () => {
  const [results, setResults] = useState<string[]>([]);

  useEffect(() => {
    const runTests = async () => {
      const testResults: string[] = [];

      // Test 1: Basic fetch
      try {
        const response = await fetch(
          "https://harvestforgood-production.up.railway.app/api/forum/posts/",
          {
            method: "GET",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }
        );
        testResults.push(
          `✅ Fetch test: ${response.status} ${response.statusText}`
        );

        if (response.ok) {
          const data = await response.json();
          testResults.push(
            `📊 Data received: ${JSON.stringify(data).substring(0, 100)}...`
          );
        }
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        testResults.push(`❌ Fetch failed: ${errorMessage}`);
      }

      // Test 2: Environment check
      testResults.push(`🌍 NODE_ENV: ${process.env.NODE_ENV}`);
      testResults.push(
        `🔗 NEXT_PUBLIC_API_URL: ${process.env.NEXT_PUBLIC_API_URL}`
      );

      setResults(testResults);
    };

    runTests();
  }, []);

  return (
    <div
      style={{ padding: "20px", fontFamily: "monospace", maxWidth: "800px" }}
    >
      <h2>🔍 Final Connection Test</h2>
      <div
        style={{
          backgroundColor: "#f5f5f5",
          padding: "15px",
          borderRadius: "5px",
        }}
      >
        {results.map((result, index) => (
          <div key={index} style={{ margin: "5px 0" }}>
            {result}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LastDitchTest;
