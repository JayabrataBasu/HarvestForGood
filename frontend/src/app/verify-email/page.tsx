"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const uid = searchParams ? searchParams.get("uid") : null;
  const token = searchParams ? searchParams.get("token") : null;

  if (uid && token) {
    return <VerifyEmailInner uid={uid} token={token} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-2 text-gray-800">
          Account Ready!
        </h1>
        <div className="mt-4 text-center text-lg text-green-700">
          Your account is already active and ready to use. No verification
          needed!
        </div>
        <a
          href="/login"
          className="mt-6 px-6 py-2 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 transition"
        >
          Go to Login
        </a>
      </div>
    </div>
  );
}

function VerifyEmailInner({ uid, token }: { uid: string; token: string }) {
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await fetch(`/api/users/verify-email/${uid}/${token}/`);
        const data = await res.json();
        if (res.ok && data.detail === "success") {
          setStatus("success");
          setMessage("Your account has been verified. You can log in now.");
        } else {
          setStatus("error");
          setMessage(data.detail || "Invalid or expired verification link.");
        }
      } catch {
        setStatus("error");
        setMessage("Could not verify your account. Please try again later.");
      }
    };
    verify();
  }, [uid, token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-2 text-gray-800">
          Email Verification
        </h1>
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
