"use client";

import { useRouter } from "next/navigation";
import { ShieldAlert, ArrowLeft, Home } from "lucide-react";

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white shadow-lg rounded-xl p-8 text-center border border-gray-100">
        {/* Icon */}
        <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-red-100 mb-6">
          <ShieldAlert className="h-10 w-10 text-red-600" />
        </div>

        {/* Text Content */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
        <p className="text-gray-500 mb-8">
          You do not have the required permissions to view this page. Please contact your administrator if you believe this is an error.
        </p>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => router.back()}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </button>
          
          <button
            onClick={() => router.push("/")}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 rounded-lg text-white font-medium hover:bg-indigo-700 transition shadow-sm"
          >
            <Home className="h-4 w-4" />
            Return Home
          </button>
        </div>
      </div>
      
      <p className="mt-8 text-sm text-gray-400">
        Error Code: 403 Forbidden
      </p>
    </div>
  );
}