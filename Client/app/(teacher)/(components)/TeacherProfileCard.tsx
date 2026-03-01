"use client";

import Image from "next/image";
import Link from "next/link"; // Link import karein navigation ke liye
import { useState } from "react";

const DEFAULT_AVATAR = "/teacherdefault.png";

interface Props {
  user: {
    _id: string; // Auth ID pass karna zaroori hai redirect ke liye
    name: string;
    email: string;
    image?: string;
  };
}

export default function TeacherProfileCard({ user }: Props) {
  const [hasError, setHasError] = useState(false);
  const src = hasError || !user?.image ? DEFAULT_AVATAR : user.image;

  return (
    <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col items-center text-center">
      <div className="relative h-24 w-24">
        <Image
          src={src}
          alt={user?.name || "User"}
          fill
          className="rounded-full object-cover ring-4 ring-indigo-50"
          onError={() => setHasError(true)}
          sizes="96px"
        />
      </div>

      <h3 className="mt-5 text-xl font-bold text-gray-900">
        {user?.name || "Unknown User"}
      </h3>
      <p className="mt-1 text-sm text-gray-500 font-medium">
        {user?.email || "no-email@example.com"}
      </p>

      {/* Navigation Buttons Container */}
      <div className="mt-6 flex flex-col gap-2 w-full">
        {/* View Button */}

        {/* Edit Button - Redirects to your specific route */}
        <Link 
          href={`/teacher/profile/edit/${user._id}`} 
          className="w-full py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition text-center"
        >
          Edit Profile
        </Link>
      </div>
    </section>
  );
}