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
  Search // Keeping for the empty state icon only
} from "lucide-react";
import { toast } from "react-toastify";
import { getStudents, deleteStudent } from "@/lib/Student/Student.teacher.api";

interface Student {
  _id: string; 
  fullName: string;
  email: string;
  rollNumber: string;
  classId: string;   
  sectionId: string; 
  gender: string;
}

export default function StudentListPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  // --- READ ALL: Fetch Students ---
  const { data: apiResponse, isLoading, isError } = useQuery({
    queryKey: ["students"],
    queryFn: getStudents,
  });

  // Extract array safely
  const students: Student[] = Array.isArray(apiResponse) 
    ? apiResponse 
    : (apiResponse?.students || apiResponse?.data || []);

  // --- DELETE: Remove Student ---
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
    if (window.confirm("Are you sure you want to delete this student? This cannot be undone.")) {
      deleteMutation.mutate(id);
    }
  };

  // --- LOADING STATE ---
  if (isLoading) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center flex-col gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
        <p className="text-gray-500 text-sm">Loading student directory...</p>
      </div>
    );
  }

  // --- ERROR STATE ---
  if (isError) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center flex-col gap-4 text-red-500">
        <AlertCircle className="h-10 w-10" />
        <p>Failed to load students. Please check your connection.</p>
        <button 
          onClick={() => queryClient.invalidateQueries({ queryKey: ["students"] })}
          className="text-sm underline hover:text-red-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <GraduationCap className="h-7 w-7 text-indigo-600" />
            Student Directory
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your students. Total Count: <span className="font-bold text-indigo-600">{students.length}</span>
          </p>
        </div>
        
        {/* Add Button */}
        <button
          onClick={() => router.push("/teacher/students/create")} 
          className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition shadow-sm font-medium active:scale-95"
        >
          <Plus className="h-5 w-5" />
          Add Student
        </button>
      </div>

      {/* Data Table */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-900 font-semibold border-b border-gray-200">
              <tr>
                <th className="px-6 py-4">Student Name</th>
                <th className="px-6 py-4">Roll No</th>
                <th className="px-6 py-4">Class / Section</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Student Id</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {students.length > 0 ? (
                students.map((student) => (
                  <tr key={student._id} className="hover:bg-gray-50 transition duration-150 group">
                    
                    {/* Name Column */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold uppercase shrink-0">
                          {student.fullName?.charAt(0) || "S"}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{student.fullName}</div>
                          <div className="text-xs text-gray-500">{student.gender}</div>
                        </div>
                      </div>
                    </td>

                    {/* Roll No */}
                    <td className="px-6 py-4 font-mono text-gray-700">
                      {student.rollNumber || "N/A"}
                    </td>

                    {/* Class Info */}
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                          {student.classId}
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-100">
                          {student.sectionId}
                        </span>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-6 py-4 text-gray-500">
                      {student.email}
                    </td>

                     {/* Student Id
                      */}
                    <td className="px-6 py-4 text-gray-500">
                      {student?.studentId || "N/A"}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => router.push(`/teacher/students/edit/${student._id}`)}
                          className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                          title="Edit Student"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        
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
                  <td colSpan={5} className="px-6 py-16 text-center text-gray-400">
                    <div className="flex flex-col items-center gap-3">
                      <div className="bg-gray-50 p-4 rounded-full">
                        <Search className="h-6 w-6 text-gray-300" />
                      </div>
                      <p className="font-medium text-gray-600">No students yet</p>
                      <p className="text-sm">Click "Add Student" to create your first record.</p>
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