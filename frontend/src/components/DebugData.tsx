import React, { useState } from "react";

interface DebugDataProps {
  data: unknown;
  title?: string;
  enabled?: boolean;
}

const DebugData: React.FC<DebugDataProps> = ({
  data,
  title = "Debug Data",
  enabled = true,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!enabled) return null;

  return (
    <div className="my-6 p-4 bg-gray-50 border border-gray-300 rounded-md">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">{title}</h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          {isExpanded ? "Hide" : "Show"}
        </button>
      </div>

      {isExpanded && (
        <pre className="mt-2 bg-white p-4 rounded overflow-auto max-h-80 text-sm">
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </div>
  );
};

export default DebugData;
