"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Loader2, Save, UserPlus, X } from "lucide-react";
import { toast } from "react-toastify";
import { createStudent } from "@/lib/Teacher/Student.teacher.api";

interface StudentFormData {
  name: string;
  email: string;
  password: string;
}

export default function CreateStudentPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<StudentFormData>();

  const mutation = useMutation({
    mutationFn: (data: StudentFormData) =>
      createStudent(data),

    onSuccess: () => {
      toast.success("Student account created successfully!");
      queryClient.invalidateQueries({ queryKey: ["students"] });
      reset();
    },

    onError: (error: any) => {
      const errMsg =
        error?.response?.data?.message ||
        "Failed to create student.";
      toast.error(errMsg);
    },
  });

  const onSubmit = (data: StudentFormData) => {
    mutation.mutate(data);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <UserPlus className="h-6 w-6 text-indigo-600" />
            Create Student Account
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            Basic authentication account for student login.
          </p>
        </div>
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 rounded-full transition"
        >
          <X className="h-5 w-5 text-gray-500" />
        </button>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

          {/* Name */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              {...register("name", {
                required: "Name is required",
              })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="e.g. Rahul Sharma"
            />
            {errors.name && (
              <p className="text-xs text-red-500">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Invalid email address",
                },
              })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="student@school.com"
            />
            {errors.email && (
              <p className="text-xs text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Minimum 6 characters required",
                },
              })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="Create password"
            />
            {errors.password && (
              <p className="text-xs text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-4 pt-4 border-t">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-300 rounded-lg transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={mutation.isPending}
              className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition disabled:opacity-50"
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Create Student
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}