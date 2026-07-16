"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  Plus,
  Trash2,
  Edit,
  Loader2,
  GraduationCap,
  AlertCircle,
  Search,
  User, // <-- Added User icon for the profile button
} from "lucide-react";
import { toast } from "react-toastify";
import { getStudents, deleteStudent } from "@/lib/Teacher/Student.teacher.api";

interface Student {
  _id: string;
  name: string;
  email: string;
  studentId?: string;
}

export default function StudentListPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    data: apiResponse,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["students"],
    queryFn: getStudents,
  });

  const students: Student[] = Array.isArray(apiResponse)
    ? apiResponse
    : apiResponse?.students || apiResponse?.data || [];

  const deleteMutation = useMutation({
    mutationFn: (studentId: string) => deleteStudent(studentId),
    onSuccess: () => {
      toast.success("Student deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
    onError: (error: any) => {
      console.error("Delete failed:", error);
      toast.error(error?.response?.data?.message || "Failed to delete student");
    },
  });

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center flex-col gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
        <p className="text-gray-500 text-sm">Loading students...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center flex-col gap-4 text-red-500">
        <AlertCircle className="h-10 w-10" />
        <p>Failed to load students.</p>
        <button
          onClick={() =>
            queryClient.invalidateQueries({ queryKey: ["students"] })
          }
          className="text-sm underline hover:text-red-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <GraduationCap className="h-7 w-7 text-indigo-600" />
            Student Directory
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Total Students:
            <span className="font-bold text-indigo-600 ml-1">
              {students.length}
            </span>
          </p>
        </div>

        <button
          onClick={() => router.push("/teacher/students/create")}
          className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition shadow-sm font-medium active:scale-95"
        >
          <Plus className="h-5 w-5" />
          Add Student
        </button>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-900 font-semibold border-b border-gray-200">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Student ID</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {students.length > 0 ? (
                students.map((student) => (
                  <tr
                    key={student._id}
                    className="hover:bg-gray-50 transition group"
                  >
                    {/* Name */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold uppercase">
                          {student.name?.charAt(0) || "S"}
                        </div>
                        <div className="font-medium text-gray-900">
                          {student.name}
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-6 py-4 text-gray-500">{student.email}</td>

                    {/* Student ID */}
                    <td className="px-6 py-4 text-gray-700 font-mono">
                      {student.studentId || "N/A"}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Profile Button */}
                        <button
                          onClick={() =>
                            router.push(
                              `/teacher/students/profile/${student._id}`,
                            )
                          }
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="View Profile"
                        >
                          <User className="h-4 w-4" />
                        </button>

                        {/* Edit Button */}
                        <button
                          onClick={() =>
                            router.push(`/teacher/students/edit/${student._id}`)
                          }
                          className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                          title="Edit Student"
                        >
                          <Edit className="h-4 w-4" />
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => handleDelete(student._id)}
                          disabled={deleteMutation.isPending}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Delete Student"
                        >
                          {deleteMutation.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-16 text-center text-gray-400"
                  >
                    <div className="flex flex-col items-center gap-3">
                      <Search className="h-6 w-6 text-gray-300" />
                      <p className="font-medium text-gray-600">
                        No students yet
                      </p>
                      <p className="text-sm">
                        Click "Add Student" to create your first record.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
