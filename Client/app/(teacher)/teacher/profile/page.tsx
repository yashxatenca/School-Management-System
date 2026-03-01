"use client";

import TeacherProfileCard from "../../(components)/TeacherProfileCard";
import TeacherDetails from "../../(components)/TeacherDetails";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import { useQuery } from "@tanstack/react-query";
import { getTeacherProfile } from "@/lib/Teacher/teacher.profile.api";
import Link from "next/link";

export default function ProfilePage() {
  const authUser = useSelector((state: RootState) => state.teacherauthstate.user);

  const { data: profile, isLoading } = useQuery({
    queryKey: ["myProfile"],
    queryFn: getTeacherProfile,
    retry: false, // Agar 404 aaye toh bar bar try na kare
  });

  if (isLoading) {
    return <div className="p-10 text-center animate-pulse">Loading Profile...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">My Profile</h1>
      
      {/* 1. Hamesha dikhega (Redux se Name/Email lega) */}
      <TeacherProfileCard 
        user={{
          _id: authUser?._id,
          name: authUser?.name,
          email: authUser?.email,
          image: profile?.profileImage || "/teacherdefault.png"
        }}
      />

      {/* 2. Conditional Section: Agar profile null hai toh "Add Details" button dikhao */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
        <h2 className="text-lg font-semibold text-gray-900 border-b pb-3 mb-6">
          Professional Information
        </h2>

        {!profile ? (
          <div className="text-center py-10">
            <p className="text-gray-500 mb-4">You haven't added your professional details yet.</p>
            <Link 
              href={`/teacher/profile/edit/${authUser?._id}`}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Complete Your Profile
            </Link>
          </div>
        ) : (
          /* Agar data hai, toh details dikhao */
          <TeacherDetails data={profile} />
        )}
      </div>
    </div>
  );
}