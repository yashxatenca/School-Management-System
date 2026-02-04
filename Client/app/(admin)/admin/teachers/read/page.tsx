"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  fetchTeachers,
  fetchTeacherById,
  Teacher,
} from "@/lib/admin_api/TeacherApi";
import { Loader2, Search, Users, AlertCircle } from "lucide-react";

export default function TeachersPage() {
  const [staffId, setStaffId] = useState("");
  const [searchId, setSearchId] = useState("");

  /* ---------------- ALL TEACHERS ---------------- */
  const {
    data: teachersResponse,
    isLoading: teachersLoading,
  } = useQuery({
    queryKey: ["teachers"],
    queryFn: fetchTeachers,
    staleTime: 5 * 60 * 1000, // cache 5 min
  });

  const teachers: Teacher[] = teachersResponse?.teachers || [];

  /* ---------------- SEARCH TEACHER ---------------- */
  const {
    data: searchedTeacher,
    isFetching: searching,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["teacher", searchId],
    queryFn: () => fetchTeacherById(searchId),
    enabled: false, // 🔴 IMPORTANT: disable auto-run
    retry: false,
    refetchOnWindowFocus: false,
  });

  const searchteacher : Teacher[] = searchedTeacher?.teacher || [];

  /* ---------------- HANDLER ---------------- */
  const handleSearch = () => {
    if (!staffId.trim()) return;
    setSearchId(staffId.trim());
    refetch(); // ✅ one-time API call
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-8">

      {/* ================= SEARCH SECTION ================= */}
      <div className="bg-white border rounded-xl p-4 sm:p-6 shadow-sm">
        <h2 className="text-base sm:text-lg font-bold mb-4 flex items-center gap-2">
          <Search size={18} className="text-indigo-600" />
          Search Teacher by Staff ID
        </h2>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            value={staffId}
            onChange={(e) => setStaffId(e.target.value)}
            placeholder="Enter Staff ID"
            className="w-full sm:flex-1 border rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none"
          />

          <button
            onClick={handleSearch}
            disabled={!staffId.trim()}
            className="w-full sm:w-auto px-5 py-2.5 bg-indigo-600 disabled:bg-indigo-300 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
          >
            Search
          </button>
        </div>

        {/* -------- SEARCH RESULT -------- */}
        <div className="mt-6 min-h-[60px]">

          {!searchId && (
            <p className="text-sm text-gray-400">
              Search by Staff ID to view teacher details
            </p>
          )}

          {searching && (
            <Loader2 className="animate-spin text-gray-500" />
          )}

          {searchId && isError && (
            <div className="flex items-center gap-2 text-red-500 font-medium text-sm">
              <AlertCircle size={18} />
              Teacher not found
            </div>
          )}

          {searchId && searchedTeacher && (
            <div className="border rounded-lg p-4 bg-gray-50 text-sm sm:text-base space-y-1">
              <p><b>Staff ID:</b> {searchteacher.staff_id}</p>
              <p><b>Name:</b> {searchteacher.name}</p>
              <p><b>Email:</b> {searchteacher.email}</p>
              <p><b>Contact:</b> {searchteacher.contact}</p>
              

            </div>
          )}
        </div>
      </div>

      {/* ================= ALL TEACHERS ================= */}
      <div>
        <h2 className="text-lg sm:text-xl font-bold mb-4 flex items-center gap-2">
          <Users size={20} className="text-indigo-600" />
          All Teachers
        </h2>

        <div className="bg-white border rounded-xl shadow-sm overflow-x-auto">
          <table className="w-full min-w-[640px] text-left">
            <thead className="bg-gray-50 border-b text-gray-600 text-sm">
              <tr>
                <th className="p-3 sm:p-4">Staff ID</th>
                <th className="p-3 sm:p-4">Name</th>
                <th className="p-3 sm:p-4">Email</th>
                <th className="p-3 sm:p-4">Contact</th>
                <th className="p-3 sm:p-4">Date of Birth</th>
                <th className="p-3 sm:p-4">Gender</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {teachersLoading && (
                <tr>
                  <td colSpan={4} className="p-6 text-center">
                    <Loader2 className="animate-spin mx-auto text-gray-500" />
                  </td>
                </tr>
              )}

              {!teachersLoading && teachers.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-6 text-center text-gray-400">
                    No teachers available
                  </td>
                </tr>
              )}

              {teachers.map((teacher) => (
                <tr
                  key={teacher.staff_id}
                  className="hover:bg-gray-50/50 text-sm sm:text-base"
                >
                  <td className="p-3 sm:p-4 font-mono">{teacher.staff_id}</td>
                  <td className="p-3 sm:p-4 font-medium">{teacher.name}</td>
                  <td className="p-3 sm:p-4 text-gray-500">{teacher.email}</td>
                  <td className="p-3 sm:p-4 text-gray-500">{teacher.contact}</td>
                <td className="p-3 sm:p-4 text-gray-500">
  {teacher.dateOfBirth
    ? new Date(teacher.dateOfBirth).toLocaleDateString("en-IN")
    : "-"}
</td>

                  <td className="p-3 sm:p-4 text-gray-500">{teacher.gender}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
