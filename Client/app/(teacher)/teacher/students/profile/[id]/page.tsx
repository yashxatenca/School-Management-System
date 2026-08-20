"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useStudentProfile } from "../_components/useStProfile"; // Hook ko apne file path ke according import karein

const StudentProfile = () => {
  // 1. Get the ID from URL
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

  // 2. Use TanStack Query custom hook
  const {
    data: profile,
    isLoading,
    isError,
    error,
  } = useStudentProfile(id as string);

  // 3. Loading State
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <p className="text-lg text-gray-600 animate-pulse">
          Loading profile details...
        </p>
      </div>
    );
  }

  // 4. Error State
  if (isError) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <p className="text-red-500 font-medium">
          {error instanceof Error
            ? error.message
            : "Failed to fetch student profile."}
        </p>
      </div>
    );
  }

  if (!profile) return null;

  // 5. Render Profile UI
  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl overflow-hidden">
        {/* Header Section */}
        <div className="bg-blue-600 p-6 text-white flex items-center space-x-6">
          <div className="h-24 w-24 bg-white rounded-full flex items-center justify-center text-blue-600 text-3xl font-bold shadow-inner uppercase">
            {profile.student_id?.name?.charAt(0)}
          </div>
          <div>
            <h1 className="text-3xl font-bold">{profile.student_id?.name}</h1>
            <p className="text-blue-100 mt-1">{profile.student_id?.email}</p>
            <div className="mt-2 inline-block bg-blue-700 px-3 py-1 rounded-full text-sm font-medium">
              Student ID: {profile.student_id?.studentId}
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Personal Information */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">
              Personal Information
            </h2>
            <div className="space-y-3 text-gray-600">
              <p>
                <span className="font-medium text-gray-900">
                  Date of Birth:
                </span>{" "}
                {profile.dob}
              </p>
              <p>
                <span className="font-medium text-gray-900">Gender:</span>{" "}
                {profile.gender}
              </p>
              <p>
                <span className="font-medium text-gray-900">Blood Group:</span>{" "}
                {profile.bloodGroup}
              </p>
              <p>
                <span className="font-medium text-gray-900">
                  Father's Name:
                </span>{" "}
                {profile.fatherName}
              </p>
              <p>
                <span className="font-medium text-gray-900">
                  Mother's Name:
                </span>{" "}
                {profile.motherName}
              </p>
            </div>
          </div>

          {/* Contact & System Info */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">
              Contact & System Info
            </h2>
            <div className="space-y-3 text-gray-600">
              <p>
                <span className="font-medium text-gray-900">
                  Phone/Contact:
                </span>{" "}
                {profile.phone}
              </p>
              <p>
                <span className="font-medium text-gray-900">Address:</span>{" "}
                {profile.address}
              </p>
              <p>
                <span className="font-medium text-gray-900">Class Ref:</span>{" "}
                {profile.student_id?.classId}
              </p>
              <p>
                <span className="font-medium text-gray-900">Profile ID:</span>{" "}
                {profile._id}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
