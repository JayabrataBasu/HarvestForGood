"use client";
import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/lib/api";

interface AdminGuardProps {
  children: ReactNode;
  redirectTo?: string;
}

export default function AdminGuard({
  children,
  redirectTo = "/login",
}: AdminGuardProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      if (!isAuthenticated()) {
        // Add the current path as next parameter for redirect after login
        const currentPath = window.location.pathname;
        router.push(`${redirectTo}?next=${encodeURIComponent(currentPath)}`);
      } else {
        setAuthorized(true);
      }
      setLoading(false);
    };

    checkAuth();
  }, [router, redirectTo]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return authorized ? <>{children}</> : null;
}
