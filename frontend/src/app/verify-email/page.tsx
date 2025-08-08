"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";

function VerifyEmailInner() {
  const params = useSearchParams();
  const uid = params?.get("uid");
  const token = params?.get("token");

  const [status] = useState<"loading" | "success" | "error">("success"); // Always show success/welcome message
  const [message] = useState(
    "Welcome to Harvest For Good! Your account has been created successfully."
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-2 text-gray-800">
          Welcome to Harvest For Good! 🌱
        </h1>
        <div className="mt-4 text-center text-lg text-green-700">
          {message}
        </div>
        <div className="mt-4 text-center text-gray-600">
          Thank you for joining our community! You can now access all features of
          our platform.
        </div>
        <a
          href="/login"
          className="mt-6 px-6 py-2 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 transition"
        >
          Continue to Login
        </a>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense>
      <VerifyEmailInner />
    </Suspense>
  );
}
        {status === "loading" && (
          <div className="flex flex-col items-center mt-6">
            <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-green-500 border-solid mb-4"></div>
            <div className="text-gray-600">Verifying your account...</div>
          </div>
        )}
        {status !== "loading" && (
          <div
            className={`mt-4 text-center text-lg ${
              status === "success" ? "text-green-700" : "text-red-600"
            }`}
          >
            {message}
          </div>
        )}
        {status === "success" && (
          <a
            href="/login"
            className="mt-6 px-6 py-2 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 transition"
          >
            Go to Login
          </a>
        )}
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense>
      <VerifyEmailInner />
    </Suspense>
  );
}
