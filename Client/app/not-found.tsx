"use client";

import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-blue-50 dark:bg-slate-900 px-4 text-center">
      
      {/* 1. Large 404 Text */}
      <h1 className="text-9xl font-black text-blue-200 dark:text-blue-900 select-none">
        404
      </h1>

      {/* 2. Error Message */}
      <div className="-mt-12 space-y-4 relative z-10">
        <h2 className="text-3xl font-bold text-slate-800 dark:text-white">
          Page Not Found
        </h2>
        <p className="text-slate-600 dark:text-slate-400 max-w-sm mx-auto">
          The page you are looking for doesn't exist or has been moved.
        </p>
      </div>

      {/* 3. Navigation Buttons */}
      <div className="mt-8 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
        {/* Back Button: Returns to previous history */}
        <button
          onClick={() => router.back()}
          className="px-6 py-3 rounded-lg border border-blue-200 dark:border-slate-700 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-slate-800 transition-colors font-medium w-full sm:w-auto"
        >
          &larr; Go Back
        </button>

        {/* Home Button: Resets to Dashboard/Home */}
        <button
          onClick={() => router.push("/")}
          className="px-6 py-3 rounded-lg border border-blue-200 dark:border-slate-700 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-slate-800 transition-colors font-medium w-full sm:w-auto"
        >
          Home
        </button>
      </div>

    </div>
  );
}