"use client";

import Image from "next/image";
import { useState } from "react";
// import defaultAvatar from '@/assets/teacher-default.png'; // optional static import

const DEFAULT_AVATAR = "/teacherdefault.png";

interface Props {
  user: TeacherProfileType;
}

export default function TeacherProfileCard({ user }: Props) {
  const [hasError, setHasError] = useState(false);

  const src = hasError || !user?.image ? DEFAULT_AVATAR : user.image;

  return (
    <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 text-center">
      <div className="relative h-20 w-20 mx-auto">
        <Image
          src={src}
          alt={`${user?.name || "Teacher"}'s profile picture`}
          fill
          className="rounded-full object-cover ring-2 ring-indigo-100 ring-offset-2"
          onError={() => setHasError(true)}
          sizes="80px"
          loading="lazy"
          // Do NOT use placeholder="blur" unless you add blurDataURL
        />
      </div>

      <h3 className="mt-4 text-lg font-semibold text-gray-900">
        {user?.name || "Teacher"}
      </h3>
      
      <p className="text-sm text-gray-600 mt-0.5">
        Staff Id:  {user?.staff_id || "XXXXXXXXXX"}
      </p> 
      <p className="text-sm text-gray-600 mt-0.5">
        {user?.subject || "Faculty"}
      </p>

      <button className="mt-5 w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition">
        View Full Profile
      </button>
    </section>
  );
}