"use client";

import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Loader2, Save, Trash2, ArrowLeft, UserCog } from "lucide-react";
import { toast } from "react-toastify";

import {
  getStudentById,
  updateStudent,
  deleteStudent,
} from "@/lib/Student/Student.teacher.api";

interface StudentFormData {
  name: string;
  email: string;
  studentId: string;
}

export default function EditStudentPage() {
  const params = useParams();
  const studentId = params.id as string;
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<StudentFormData>();

  // ==========================
  // 1. FETCH STUDENT
  // ==========================
  const { data: student, isLoading, isError } = useQuery({
    queryKey: ["student", studentId],
    queryFn: async () => {
      const res = await getStudentById(studentId);
      return res.data || res;
    },
    enabled: !!studentId,
  });

  // ==========================
  // 2. PREFILL FORM
  // ==========================
  useEffect(() => {
    if (student) {
      setValue("name", student.name);
      setValue("email", student.email);
      setValue("studentId", student.studentId);
    }
  }, [student, setValue]);

  // ==========================
  // 3. UPDATE
  // ==========================
  const updateMutation = useMutation({
    mutationFn: (data: StudentFormData) =>
      updateStudent({ ...data, _id: studentId }),
    onSuccess: () => {
      toast.success("Student updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["students"] });
      router.push("/teacher/students/show");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to update student."
      );
    },
  });

  // ==========================
  // 4. DELETE
  // ==========================
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteStudent(id),
    onSuccess: () => {
      toast.success("Student deleted permanently.");
      queryClient.invalidateQueries({ queryKey: ["students"] });
      router.push("/teacher/students/show");
    },
    onError: () => {
      toast.error("Failed to delete student.");
    },
  });

  const onSubmit = (data: StudentFormData) => {
    updateMutation.mutate(data);
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      deleteMutation.mutate(studentId);
    }
  };

  // ==========================
  // LOADING / ERROR
  // ==========================
  if (isLoading)
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );

  if (isError)
    return (
      <div className="p-8 text-center text-red-500">
        Failed to load student data.
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto p-6">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <button
            onClick={() => router.back()}
            className="text-gray-500 hover:text-gray-800 flex items-center gap-1 text-sm mb-2 transition"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <UserCog className="h-6 w-6 text-indigo-600" />
            Edit Student
          </h1>
        </div>

        <button
          onClick={handleDelete}
          className="p-2 text-red-600 hover:bg-red-50 rounded-full transition"
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

          {/* Full Name */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              {...register("name", { required: "Name is required" })}
              className="w-full mt-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            {errors.name && (
              <p className="text-xs text-red-500 mt-1">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              {...register("email", { required: "Email is required" })}
              className="w-full mt-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Student ID */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Student ID
            </label>
            <input
              {...register("studentId", { required: "Student ID is required" })}
              className="w-full mt-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            {errors.studentId && (
              <p className="text-xs text-red-500 mt-1">
                {errors.studentId.message}
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-between pt-6 border-t">

            <button
              type="button"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition"
            >
              {deleteMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
              Delete
            </button>

            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition disabled:opacity-50"
            >
              {updateMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}