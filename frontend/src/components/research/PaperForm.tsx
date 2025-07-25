import React from "react";

// ...you can expand this form later...
export default function PaperForm() {
  return (
    <form>
      <div>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          name="title"
          type="text"
          className="border rounded px-2 py-1 w-full"
        />
      </div>
      {/* ...add more fields as needed... */}
      <button
        type="submit"
        className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded"
      >
        Submit
      </button>
    </form>
  );
}
