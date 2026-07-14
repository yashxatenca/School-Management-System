"use client";

import React, { useState } from "react";
// TODO: Update paths based on your actual folder structure and hook names
import { useGetTeachers } from "@/hooks/Admin/useTeacher";
import {
  useGetTimetablesByTeacher,
  useCreateTeacherTimetable,
  useDeleteTeacherTimetable,
} from "@/hooks/Admin/useAdminTeacherTimetable";

export default function TeacherTimetableManager() {
  const { data: teachers = [], isLoading: isLoadingTeachers } =
    useGetTeachers();

  // --- FORM STATES (For Adding) ---
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [driveLink, setDriveLink] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState("");

  // --- VIEW STATE (For Listing) ---
  const [viewTeacherId, setViewTeacherId] = useState("");

  // --- TANSTACK QUERY HOOKS ---
  const { data: timetables = [], isLoading: isFetchingTimetables } =
    useGetTimetablesByTeacher(viewTeacherId);

  const createMutation = useCreateTeacherTimetable();
  const deleteMutation = useDeleteTeacherTimetable();

  // Safely extract arrays
  const teacherList = Array.isArray(teachers.teachers)
    ? teachers.teachers
    : teachers?.teachers || [];
  const timetableList = Array.isArray(timetables)
    ? timetables
    : timetables?.data || [];

  // --- HANDLERS ---
  const handleAddTimetable = (e: React.FormEvent) => {
    e.preventDefault();
    if (!driveLink.includes("drive.google.com")) {
      alert("Please enter a valid Google Drive link!");
      return;
    }
    if (!selectedTeacher) {
      alert("Please select a teacher!");
      return;
    }

    const principalId = "demo-principal-id-123";

    createMutation.mutate(
      {
        title,
        category,
        driveLink,
        teacherId: selectedTeacher,
        principalId,
      },
      {
        onSuccess: () => {
          alert("Timetable added successfully!");
          // Form reset
          setTitle("");
          setCategory("");
          setDriveLink("");
          setSelectedTeacher("");

          // Automatically show the list of the teacher we just added a timetable to
          setViewTeacherId(selectedTeacher);
        },
        onError: () => {
          alert("Failed to add timetable. Please try again.");
        },
      },
    );
  };

  const handleDelete = (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this timetable?",
    );
    if (!confirmDelete) return;

    deleteMutation.mutate(id);
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 min-h-screen bg-gray-50">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Teacher Timetable Management
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Upload and manage Google Drive links for various schedules.
        </p>
      </div>

      {/* ADD NEW TIMETABLE SECTION */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          Add New Timetable
        </h2>

        <form onSubmit={handleAddTimetable} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Teacher Selection */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-600 mb-1">
                Teacher
              </label>
              <select
                required
                value={selectedTeacher}
                onChange={(e) => setSelectedTeacher(e.target.value)}
                disabled={isLoadingTeachers}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-100 disabled:text-gray-400"
              >
                <option value="" disabled>
                  {isLoadingTeachers ? "Loading..." : "Select a Teacher"}
                </option>
                {teacherList.map((teacher: any) => (
                  <option key={teacher._id} value={teacher._id}>
                    {teacher.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Title */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-600 mb-1">
                Title (Batch/Section)
              </label>
              <input
                type="text"
                required
                placeholder="E.G. MATH - 10TH"
                value={title}
                onChange={(e) => setTitle(e.target.value.toUpperCase())}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none uppercase"
              />
            </div>

            {/* Category */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-600 mb-1">
                Category
              </label>
              <input
                type="text"
                required
                placeholder="E.G. DAILY ROUTINE"
                value={category}
                onChange={(e) => setCategory(e.target.value.toUpperCase())}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none uppercase"
              />
            </div>

            {/* Drive Link */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-600 mb-1">
                Google Drive URL
              </label>
              <input
                type="url"
                required
                placeholder="https://drive.google.com/..."
                value={driveLink}
                onChange={(e) => setDriveLink(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Warning Banner */}
          <div className="bg-amber-50 border-l-4 border-amber-400 p-3 rounded-r-lg text-sm text-amber-800 flex items-start gap-2">
            <span>⚠️</span>
            <p>
              <strong>Important:</strong> Ensure the Google Drive link
              permission is set to <b>"Anyone with the link can view"</b>.
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={createMutation.isPending}
              className={`px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-sm hover:bg-blue-700 transition ${
                createMutation.isPending ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {createMutation.isPending ? "Adding..." : "Add Timetable"}
            </button>
          </div>
        </form>
      </div>

      <hr className="border-gray-200" />

      {/* VIEW TIMETABLES SECTION */}
      <div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h2 className="text-lg font-semibold text-gray-700">
            Uploaded Timetables
          </h2>

          {/* Filter for viewing timetables */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-600">
              Filter by Teacher:
            </label>
            <select
              value={viewTeacherId}
              onChange={(e) => setViewTeacherId(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
            >
              <option value="">-- Select Teacher --</option>
              {teacherList.map((teacher: any) => (
                <option key={teacher._id} value={teacher._id}>
                  {teacher.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Loading State */}
        {isFetchingTimetables && (
          <div className="w-full flex justify-center p-8">
            <div className="flex items-center gap-2 text-gray-500 font-medium">
              Loading timetables...
            </div>
          </div>
        )}

        {/* Empty States */}
        {!viewTeacherId && !isFetchingTimetables && (
          <div className="text-center text-gray-500 py-12 bg-white w-full rounded-xl border border-gray-100 border-dashed">
            Please select a teacher from the dropdown above to view their
            timetables.
          </div>
        )}

        {viewTeacherId &&
          !isFetchingTimetables &&
          timetableList.length === 0 && (
            <div className="text-center text-gray-500 py-12 bg-white w-full rounded-xl border border-gray-100 border-dashed">
              No timetables found for this teacher.
            </div>
          )}

        {/* Grid List */}
        {viewTeacherId && timetableList.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {timetableList.map((item: any) => (
              <div
                key={item._id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition flex flex-col h-full"
              >
                <div className="flex justify-between items-start mb-3">
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700">
                    {item.category}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="font-bold text-gray-800 text-lg mb-4 line-clamp-2">
                  {item.title}
                </h3>

                <div className="mt-auto space-y-3">
                  <a
                    href={item.driveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-blue-50 border border-blue-200 text-blue-700 font-medium rounded-lg hover:bg-blue-100 transition"
                  >
                    View on Drive
                  </a>

                  {/* ONLY DELETE BUTTON REMAINS */}
                  <button
                    onClick={() => handleDelete(item._id)}
                    disabled={deleteMutation.isPending}
                    className="w-full flex items-center justify-center gap-1 px-4 py-2 bg-red-50 border border-red-200 text-red-600 font-medium rounded-lg hover:bg-red-100 transition disabled:opacity-50"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    {deleteMutation.isPending ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
