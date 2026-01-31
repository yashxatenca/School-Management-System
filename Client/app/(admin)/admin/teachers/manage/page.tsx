"use client";

import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  fetchTeacherById,
  updateTeacher,
  Teacher,
} from "@/lib/admin_api/TeacherApi";

import {
  Search,
  X,
  Check,
  Loader2,
  AlertCircle,
  User,
  Calendar,
  Mail,
  Phone,
} from "lucide-react";

export default function ManageTeacherByIdPage() {
  const [staffId, setStaffId] = useState("");
  const [searchId, setSearchId] = useState("");
  const [editTarget, setEditTarget] = useState<Teacher | null>(null);
  const [noData, setNoData] = useState(false);

  /* ================= SEARCH (MANUAL ONLY) ================= */
  const {
    isFetching: searching,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["teacher", searchId],
    queryFn: () => fetchTeacherById(searchId),
    enabled: false,
    retry: false,
    refetchOnWindowFocus: false,
  });

  /* ================= UPDATE ================= */
  const updateMutation = useMutation({
    mutationFn: updateTeacher,
    onSuccess: () => {
      toast.success("Teacher updated successfully ✅");
      setEditTarget(null);
      setStaffId("");
      setSearchId("");
      setNoData(false);
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to update teacher ❌");
    },
  });

  /* ================= HANDLERS ================= */
  const handleSearch = async () => {
    if (!staffId.trim()) return;

    setSearchId(staffId.trim());
    setEditTarget(null);
    setNoData(false);

    const res = await refetch();
    const teacher = res.data?.teacher;

    if (!teacher || (Array.isArray(teacher) && teacher.length === 0)) {
      setNoData(true);
      return;
    }

    setEditTarget(Array.isArray(teacher) ? teacher[0] : teacher);
  };

  const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editTarget) return;

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    updateMutation.mutate({
      id: editTarget.staff_id,
      data,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 sm:p-6">
      <div className="max-w-xl mx-auto space-y-6">
        
        {/* ================= SEARCH CARD ================= */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-800">
            <Search size={20} className="text-indigo-600" />
            Find Teacher
          </h2>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                value={staffId}
                onChange={(e) => setStaffId(e.target.value)}
                placeholder="Enter Staff ID..."
                className="w-full border border-gray-200 rounded-xl px-4 py-3 pl-4 text-base focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              />
            </div>

            <button
              onClick={handleSearch}
              disabled={!staffId.trim()}
              className="w-full sm:w-auto px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 shadow-md shadow-indigo-200"
            >
              Search
            </button>
          </div>

          {searching && (
            <div className="mt-6 flex justify-center">
              <Loader2 className="animate-spin text-indigo-600" size={24} />
            </div>
          )}

          {isError && (
            <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg flex items-center gap-2 text-sm font-medium">
              <AlertCircle size={18} />
              Teacher not found
            </div>
          )}
        </div>

        {/* ================= NO DATA STATE ================= */}
        {noData && !searching && (
          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 text-amber-800 flex items-center gap-3">
            <AlertCircle size={20} className="shrink-0" />
            <span className="font-medium">No records found for this ID.</span>
          </div>
        )}

        {/* ================= EDIT FORM CARD ================= */}
        {editTarget && (
          <form
            onSubmit={handleUpdate}
            className="bg-white border border-gray-100 rounded-2xl p-5 sm:p-8 shadow-lg ring-1 ring-black/5 animate-in fade-in slide-in-from-bottom-4 duration-300"
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Edit Details</h3>
                <p className="text-sm text-gray-500">Update staff information below</p>
              </div>
              <button
                type="button"
                onClick={() => setEditTarget(null)}
                className="p-2 -mr-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-5">
              {/* Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
                  <User size={14} /> Name
                </label>
                <input
                  name="name"
                  defaultValue={editTarget.name}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-base focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  required
                />
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
                  <Mail size={14} /> Email
                </label>
                <input
                  name="email"
                  type="email"
                  defaultValue={editTarget.email}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-base focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  required
                />
              </div>

              {/* Contact */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
                  <Phone size={14} /> Contact
                </label>
                <input
                  name="contact"
                  defaultValue={editTarget.contact}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-base focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  required
                />
              </div>

              {/* Grid for Date & Gender */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
                    <Calendar size={14} /> DOB
                  </label>
                  <input
                    name="dateOfBirth"
                    type="date"
                    defaultValue={
                      editTarget.dateOfBirth
                        ? new Date(editTarget.dateOfBirth)
                            .toISOString()
                            .split("T")[0]
                        : ""
                    }
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-base focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                    Gender
                  </label>
                  <div className="relative">
                    <select
                      name="gender"
                      defaultValue={editTarget.gender}
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-base focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none appearance-none transition-all"
                      required
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                    {/* Custom Arrow for consistency */}
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                      <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 1L5 5L9 1" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <button
                type="submit"
                disabled={updateMutation.isPending}
                className="w-full py-3.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 transition-all"
              >
                {updateMutation.isPending ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <Check size={20} />
                )}
                Update Teacher
              </button>
            </div>
          </form>
        )}

        <ToastContainer position="bottom-center" autoClose={2000} theme="colored" />
      </div>
    </div>
  );
}