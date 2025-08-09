"use client";

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-2 text-gray-800">
          Welcome to Harvest For Good!
        </h1>
        <div className="mt-4 text-center text-lg text-green-700">
          <p>
            Thank you for joining our community. Your account is ready to use!
          </p>
          <p className="mt-2">
            Together, we can reduce food waste and help connect fresh produce to
            those in need.
          </p>
          <p className="mt-2">Log in now to start making a difference.</p>
        </div>
        <a
          href="https://harvestforgood.vercel.app/login"
          className="mt-8 px-6 py-2 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 transition"
        >
          Go to Login
        </a>
      </div>
    </div>
  );
}
