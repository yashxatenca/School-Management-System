"use client"; // Error components must be Client Components

import { useEffect } from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  
  useEffect(() => {
    // Log the error to an error reporting service if needed
    console.error("Application Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white shadow-lg rounded-xl p-8 text-center border border-gray-100">
        {/* Icon */}
        <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-amber-100 mb-6">
          <AlertTriangle className="h-10 w-10 text-amber-600" />
        </div>

        {/* Text Content */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong!</h1>
        <p className="text-gray-500 mb-8">
          We encountered an unexpected error while processing your request. 
          <br />
          <span className="text-xs text-gray-400 mt-2 block font-mono bg-gray-100 p-1 rounded">
            {error.message || "Unknown Error"}
          </span>
        </p>

        {/* Action Button */}
        <button
          onClick={
            // Attempt to recover by trying to re-render the segment
            () => reset()
          }
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 rounded-lg text-white font-medium hover:bg-indigo-700 transition shadow-sm"
        >
          <RefreshCcw className="h-4 w-4" />
          Try Again
        </button>
      </div>
    </div>
  );
}