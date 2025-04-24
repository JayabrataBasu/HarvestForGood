"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Dashboard() {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();
  const [isLogoutLoading, setIsLogoutLoading] = useState(false);

  useEffect(() => {
    // If user is not logged in and the auth check is complete, redirect to login
    if (!user && !isLoading) {
      router.push("/login?redirect=/dashboard");
    }
  }, [user, isLoading, router]);

  const handleLogout = async () => {
    setIsLogoutLoading(true);
    await logout();
    setIsLogoutLoading(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-soft-green to-background py-12">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-primary-dark">
              User Dashboard
            </h1>
            <button
              onClick={handleLogout}
              disabled={isLogoutLoading}
              className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md transition duration-300 flex items-center disabled:opacity-50"
            >
              {isLogoutLoading ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
              ) : null}
              Logout
            </button>
          </div>

          <div className="mb-8 p-4 bg-gray-50 rounded-md">
            <h2 className="text-xl font-semibold mb-4">Account Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">Username</p>
                <p className="font-medium">{user.username}</p>
              </div>
              <div>
                <p className="text-gray-600">Email</p>
                <p className="font-medium">{user.email}</p>
              </div>
              {user.first_name && (
                <div>
                  <p className="text-gray-600">First Name</p>
                  <p className="font-medium">{user.first_name}</p>
                </div>
              )}
              {user.last_name && (
                <div>
                  <p className="text-gray-600">Last Name</p>
                  <p className="font-medium">{user.last_name}</p>
                </div>
              )}
              <div>
                <p className="text-gray-600">Email Verified</p>
                <p
                  className={`font-medium ${
                    user.email_verified ? "text-green-600" : "text-orange-500"
                  }`}
                >
                  {user.email_verified ? "Yes" : "No"}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-green-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-lg font-semibold mb-3 text-green-800">
                Forum Activities
              </h3>
              <p className="text-gray-600 mb-4">
                View and manage your forum posts and comments.
              </p>
              <Link
                href="/forums/posts"
                className="text-green-700 hover:text-green-900 font-medium"
              >
                Go to Forums →
              </Link>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-lg font-semibold mb-3 text-blue-800">
                Research Papers
              </h3>
              <p className="text-gray-600 mb-4">
                Access research papers and academic resources.
              </p>
              <Link
                href="/research"
                className="text-blue-700 hover:text-blue-900 font-medium"
              >
                Browse Research →
              </Link>
            </div>

            <div className="bg-purple-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-lg font-semibold mb-3 text-purple-800">
                Categories
              </h3>
              <p className="text-gray-600 mb-4">
                Explore different food and agriculture categories.
              </p>
              <Link
                href="/categories"
                className="text-purple-700 hover:text-purple-900 font-medium"
              >
                View Categories →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
