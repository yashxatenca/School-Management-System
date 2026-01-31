"use client";

import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTeacher, fetchTeacherById } from "@/lib/admin_api/TeacherApi";
import {
  Search,
  Trash2,
  AlertCircle,
  UserX,
  Loader2,
} from "lucide-react";
import { Teacher } from "@/lib/admin_api/TeacherApi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function DeleteTeacherPage() {
  const queryClient = useQueryClient();

  const [searchId, setSearchId] = useState("");
  const [foundTeacher, setFoundTeacher] = useState<Teacher | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  /* ---------------- SEARCH ---------------- */
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchId.trim()) return;

    setIsSearching(true);
    setFoundTeacher(null);

    try {
      const data = await fetchTeacherById(searchId.trim());
      setFoundTeacher(data?.teacher ?? data);
    } catch {
      toast.error("Teacher not found with this Staff ID ❌");
    } finally {
      setIsSearching(false);
    }
  };

  /* ---------------- DELETE ---------------- */
  const deleteMutation = useMutation({
    mutationFn: deleteTeacher,
    onSuccess: () => {
      toast.success("Teacher deleted successfully ✅");
      setFoundTeacher(null);
      setSearchId("");
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to delete teacher ❌"
      );
    },
  });


  return (
    <div className="p-6 max-w-3xl mx-auto">
      <ToastContainer position="top-right" autoClose={2500} />

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Delete Teacher Record
        </h1>
        <p className="text-sm text-gray-500">
          Search by Staff ID to identify and remove a teacher.
        </p>
      </div>

      {/* ================= SEARCH ================= */}
      <form onSubmit={handleSearch} className="flex gap-2 mb-8">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Enter Staff ID (e.g., TCH-JAN-1234)"
            className="w-full pl-10 pr-4 py-3 border-2 border-gray-100 rounded-xl focus:border-indigo-500 outline-none transition"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={isSearching}
          className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 disabled:bg-gray-400 transition"
        >
          {isSearching ? <Loader2 className="animate-spin" /> : "Search"}
        </button>
      </form>

      {/* ================= RESULT ================= */}
     {foundTeacher ? (
  <div className="bg-white border-2 border-red-100 rounded-2xl p-4 sm:p-8 shadow-sm">

    {/* Header */}
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
      <div className="flex items-center gap-4">
        <div className="h-14 w-14 sm:h-16 sm:w-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center font-bold text-xl sm:text-2xl shrink-0">
          {foundTeacher.name.charAt(0)}
        </div>
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">
            {foundTeacher.name}
          </h2>
          <p className="text-indigo-600 font-mono text-xs sm:text-sm break-all">
            {foundTeacher.staff_id}
          </p>
        </div>
      </div>

      <span className="self-start bg-red-50 text-red-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
        Target Record
      </span>
    </div>

    {/* Details */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8 text-sm border-y border-gray-50 py-4 sm:py-6">
      <div>
        <p className="text-gray-400 mb-1">Email</p>
        <p className="font-medium break-all">{foundTeacher.email}</p>
      </div>
      <div>
        <p className="text-gray-400 mb-1">Contact</p>
        <p className="font-medium break-all">{foundTeacher.contact}</p>
      </div>
    </div>

    {/* Warning */}
    <div className="bg-red-50 p-4 rounded-xl flex gap-3 mb-6">
      <AlertCircle className="text-red-600 shrink-0 mt-0.5" size={20} />
      <p className="text-sm text-red-800">
        This action is irreversible. The teacher will permanently lose access.
      </p>
    </div>

    {/* Action Button */}
    <button
      onClick={() =>
        confirm(
          `Are you sure you want to permanently delete ${foundTeacher.name}?`
        ) && deleteMutation.mutate(foundTeacher?._id)
      }
      disabled={deleteMutation.isPending}
      className="w-full bg-red-600 text-white py-3 sm:py-4 rounded-xl font-bold hover:bg-red-700 transition flex items-center justify-center gap-2"
    >
      {deleteMutation.isPending ? (
        <Loader2 className="animate-spin" />
      ) : (
        <Trash2 size={20} />
      )}
      {deleteMutation.isPending
        ? "Deleting..."
        : "Confirm Permanent Deletion"}
    </button>
  </div>
) : (
  !isSearching && (
    <div className="text-center py-14 sm:py-20 border-2 border-dashed border-gray-100 rounded-2xl bg-gray-50/50">
      <UserX className="mx-auto text-gray-300 mb-4" size={48} />
      <p className="text-gray-500">
        Enter a Staff ID to begin the deletion process.
      </p>
    </div>
  )
)}
    </div>
  );
}
