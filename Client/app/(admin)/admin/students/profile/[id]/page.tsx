"use client";

import React from "react";
import { StudentProfile } from "../../_components/student.interface"; // Adjust import path as needed
import { useGetStudentById } from "@/lib/Admin/AdminStudentApi";
import { useParams, usePathname } from "next/navigation";

export default function StudentProfilePage() {
  const params = useParams();
  const {
    data: student,
    isLoading,
    isError,
  } = useGetStudentById(params.id as string);

  // Handle the loading state while React Query fetches the data
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <h2 className="text-xl font-semibold text-gray-700">
          Loading student profile...
        </h2>
      </div>
    );
  }

  // Handle errors or a null/undefined student response
  if (isError || !student) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <h2 className="text-2xl font-semibold text-gray-700">
          Student not found
        </h2>
      </div>
    );
  }

  // Format the date for cleaner UI
  const joinedDate = new Date(student.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header Section */}
        <div className="flex items-center justify-between rounded-xl bg-white p-6 shadow-sm">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{student.name}</h1>
            <p className="mt-1 text-sm text-gray-500">
              Student ID:{" "}
              <span className="font-medium text-gray-900">
                {student.studentId}
              </span>
            </p>
          </div>
          <div className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
            Active Student
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Personal Information */}
          <div className="rounded-xl bg-white p-6 shadow-sm border-t-4 border-blue-500">
            <h2 className="mb-4 text-xl font-semibold text-gray-800">
              Personal Info
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">Email</span>
                <span className="font-medium text-gray-900">
                  {student.email}
                </span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">Joined Date</span>
                <span className="font-medium text-gray-900">{joinedDate}</span>
              </div>
              <div className="flex justify-between pb-2"></div>
            </div>
          </div>

          {/* Academic Information */}
          <div className="rounded-xl bg-white p-6 shadow-sm border-t-4 border-green-500">
            <h2 className="mb-4 text-xl font-semibold text-gray-800">
              Academic Details
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">Class</span>
                <span className="font-medium text-gray-900">
                  {student.classId.name} - Section {student.classId.section}
                </span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">Academic Year</span>
                <span className="font-medium text-gray-900">
                  {student.classId.academicYear}
                </span>
              </div>
              <div className="flex justify-between pb-2">
                <span className="text-gray-500">Class Status</span>
                <span
                  className={`font-medium ${student.classId.isActive ? "text-green-600" : "text-red-600"}`}
                >
                  {student.classId.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </div>

          {/* Class Teacher Information */}
          <div className="md:col-span-2 rounded-xl bg-white p-6 shadow-sm border-t-4 border-purple-500">
            <h2 className="mb-4 text-xl font-semibold text-gray-800">
              Assigned Class Teacher
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 text-sm">
              <div>
                <p className="text-gray-500 mb-1">Teacher Name</p>
                <p className="font-medium text-gray-900">
                  {student.teacherId.name}
                </p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Teacher ID</p>
                <p className="font-medium text-gray-900">
                  {student.teacherId.teacher_id}
                </p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Email</p>
                <p className="font-medium text-gray-900">
                  {student.teacherId.email}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
