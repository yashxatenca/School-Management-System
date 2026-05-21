"use client";

import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchTeachers,
  deleteTeacher,
  Teacher,
} from "@/lib/Admin/TeacherApi";
import { Loader2, Users, Edit, Trash2 } from "lucide-react";

export default function TeachersPage() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["teachers"],
    queryFn: fetchTeachers,
    staleTime: 5 * 60 * 1000,
  });

  const teachers: Teacher[] = data?.teachers ?? [];

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteTeacher(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
    },
  });

  const handleDelete = (id: string) => {
    if (confirm("Delete this teacher permanently?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Users size={20} className="text-indigo-600" />
          All Teachers
        </h2>

        <Link
          href="/admin/teachers/create"
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          + Add Teacher
        </Link>
      </div>

      {/* Table */}
      <div className="bg-white border rounded-xl shadow-sm overflow-x-auto">
        <table className="w-full min-w-[700px] text-left">
          <thead className="bg-gray-50 border-b text-gray-600 text-sm">
            <tr>
              <th className="p-4">Teacher ID</th>
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {isLoading && (
              <tr>
                <td colSpan={4} className="p-6 text-center">
                  <Loader2 className="animate-spin mx-auto text-gray-500" />
                </td>
              </tr>
            )}

            {!isLoading && teachers.length === 0 && (
              <tr>
                <td colSpan={4} className="p-6 text-center text-gray-400">
                  No teachers available
                </td>
              </tr>
            )}

            {teachers.map((teacher) => (
              <tr key={teacher.teacher_id} className="hover:bg-gray-50">
                <td className="p-4 font-mono">
                  {teacher.teacher_id}
                </td>

                <td className="p-4 font-medium">
                  {teacher.name}
                </td>

                <td className="p-4 text-gray-500">
                  {teacher.email}
                </td>

                <td className="p-4">
                  <div className="flex justify-center gap-2">
                    <Link
                      href={`/admin/teachers/edit/${teacher._id!}`}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                    >
                      <Edit size={18} />
                    </Link>

                    <button
                      onClick={() => handleDelete(teacher._id!)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}