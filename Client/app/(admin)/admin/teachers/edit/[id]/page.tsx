"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchTeacherById, updateTeacher } from "@/lib/Admin/TeacherApi";
import { Loader2, Save, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function EditTeacherPage() {
  const router = useRouter();
  const params = useParams();
  const queryClient = useQueryClient();
  const id = params.id as string; // Mongo _id

  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  /* ================= FETCH TEACHER ================= */
  const { data, isLoading } = useQuery({
    queryKey: ["teacher", id],
    queryFn: () => fetchTeacherById(id),
    enabled: !!id,
  });

  // ✅ IMPORTANT FIX
  const teacher = data?.data;

  /* ================= AUTO FILL ================= */
  useEffect(() => {
    if (teacher) {
      setFormData({
        name: teacher.name || "",
        email: teacher.email || "",
      });
    }
  }, [teacher]);

  /* ================= UPDATE ================= */
  const updateMutation = useMutation({
    mutationFn: () => updateTeacher(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      queryClient.invalidateQueries({ queryKey: ["teacher", id] });
      router.push("/admin/teachers/read");
    },
    onError: (error) => {
      console.error("Update failed:", error);
      alert("Failed to update teacher");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate();
  };

  /* ================= LOADING ================= */
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-indigo-600" size={40} />
      </div>
    );
  }

  if (!teacher) {
    return (
      <div className="text-center py-10 text-gray-500">
        Teacher not found
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">

      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/admin/teachers/read"
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-xl font-bold">Edit Teacher</h1>
      </div>

      <div className="bg-white border rounded-xl p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Teacher ID (Read Only) */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
              Teacher ID
            </label>
            <input
              value={teacher.teacher_id}
              disabled
              className="w-full bg-gray-100 border rounded-lg p-2.5 text-gray-500 font-mono"
            />
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Full Name
            </label>
            <input
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none"
              required
            />
          </div>

          {/* Buttons */}
          <div className="pt-4 flex gap-3">
            <Link
              href="/admin/teachers/read"
              className="flex-1 py-2.5 border rounded-lg text-center font-medium hover:bg-gray-50"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="flex-1 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 flex justify-center items-center gap-2"
            >
              {updateMutation.isPending ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Save size={18} />
              )}
              Save Changes
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}