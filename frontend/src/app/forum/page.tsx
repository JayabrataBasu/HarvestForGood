"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ForumRedirect() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect from /forum to /forums
    router.replace('/forums');
  }, [router]);
  
  // Display a loading state while redirecting
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
    </div>
  );
}
