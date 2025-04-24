import React, { useState } from "react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useRouter } from "next/navigation";

interface GuestAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (guestInfo: GuestInfo) => void;
  mode: "post" | "comment";
}

export interface GuestInfo {
  name: string;
  affiliation: string;
  email?: string;
}

export default function GuestAuthModal({
  isOpen,
  onClose,
  onSubmit,
  mode,
}: GuestAuthModalProps) {
  const [guestName, setGuestName] = useState("");
  const [guestAffiliation, setGuestAffiliation] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!guestName.trim()) {
      setError("Name is required");
      return;
    }

    if (!guestAffiliation.trim()) {
      setError("Affiliation is required");
      return;
    }

    const guestInfo: GuestInfo = {
      name: guestName.trim(),
      affiliation: guestAffiliation.trim(),
      email: guestEmail.trim() || undefined,
    };

    // Store in localStorage for persistent guest session
    localStorage.setItem("guestInfo", JSON.stringify(guestInfo));

    onSubmit(guestInfo);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-scale-in">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Guest Information
        </h2>

        <p className="text-gray-600 mb-6">
          {mode === "post"
            ? "Please provide your information to create a post as a guest."
            : "Please provide your information to comment as a guest."}
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="guestName"
              className="block text-sm font-medium text-gray-700"
            >
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="guestName"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="guestAffiliation"
              className="block text-sm font-medium text-gray-700"
            >
              Affiliation <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="guestAffiliation"
              value={guestAffiliation}
              onChange={(e) => setGuestAffiliation(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500"
              required
              placeholder="Organization, University, etc."
            />
          </div>

          <div>
            <label
              htmlFor="guestEmail"
              className="block text-sm font-medium text-gray-700"
            >
              Email (Optional)
            </label>
            <input
              type="email"
              id="guestEmail"
              value={guestEmail}
              onChange={(e) => setGuestEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500"
              placeholder="Your email (not required)"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
