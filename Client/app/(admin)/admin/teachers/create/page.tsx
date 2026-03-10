"use client";

import React, { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { createTeacher } from "@/lib/admin_api/TeacherApi";
import {
  UserPlus,
  ArrowLeft,
  Loader2,
  CheckCircle,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";

export default function CreateTeacherPage() {
  const router = useRouter();
  const [generatedId, setGeneratedId] = useState("");
  const [teacherName, setTeacherName] = useState("");

  // Generate Teacher ID
  const generateTeacherId = (name: string) => {
    const prefix = "TCH";
    const namePart =
      name.replace(/\s+/g, "").substring(0, 3).toUpperCase() || "USR";
    const randomPart = Math.floor(1000 + Math.random() * 9000);
    return `${prefix}-${namePart}-${randomPart}`;
  };

  useEffect(() => {
    if (teacherName.length >= 3) {
      setGeneratedId(generateTeacherId(teacherName));
    }
  }, [teacherName]);

  const mutation = useMutation({
    mutationFn: createTeacher,
    onSuccess: () => {
      toast.success("Teacher created successfully");
      router.push("/admin/teachers/read"); // redirect to list page
    },
    onError: (error: any) =>
      toast.error(
        error.response?.data?.message || "Failed to create teacher"
      ),
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    mutation.mutate({
      name: data.name as string,
      teacher_id: generatedId,
      email: data.email as string,
      password: data.password as string,
    });
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <Link
          href="/admin/dashboard"
          className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition"
        >
          <ArrowLeft size={20} />
          <span>Back to Dashboard</span>
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-lg text-white">
              <UserPlus size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Add New Teacher
              </h1>
              <p className="text-sm text-gray-500">
                Teacher ID is auto-generated.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-5">
            {/* Name */}
            <div>
              <label className="text-sm font-semibold text-gray-700">
                Full Name
              </label>
              <input
                name="name"
                type="text"
                placeholder="John Doe"
                onChange={(e) => setTeacherName(e.target.value)}
                className="w-full mt-1 px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                required
              />
            </div>

            {/* Generated Teacher ID */}
            <div>
              <label className="text-sm font-semibold text-gray-700">
                Generated Teacher ID
              </label>
              <div className="relative mt-1">
                <input
                  value={generatedId}
                  readOnly
                  placeholder="Waiting for name..."
                  className="w-full px-4 py-2.5 border rounded-lg bg-gray-50 text-gray-600 font-mono outline-none"
                />
                <button
                  type="button"
                  onClick={() =>
                    setGeneratedId(generateTeacherId(teacherName))
                  }
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-indigo-600"
                >
                  <RefreshCw size={16} />
                </button>
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="text-sm font-semibold text-gray-700">
                Email
              </label>
              <input
                name="email"
                type="email"
                placeholder="teacher@school.com"
                className="w-full mt-1 px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-sm font-semibold text-gray-700">
                Password
              </label>
              <input
                name="password"
                type="password"
                placeholder="••••••••"
                className="w-full mt-1 px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                required
              />
            </div>
          </div>

          <div className="pt-4 border-t flex justify-end">
            <button
              type="submit"
              disabled={mutation.isPending || !generatedId}
              className="flex items-center gap-2 bg-indigo-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-indigo-700 disabled:bg-gray-300 transition"
            >
              {mutation.isPending ? (
                <Loader2 className="animate-spin" />
              ) : (
                <CheckCircle size={20} />
              )}
              {mutation.isPending
                ? "Creating..."
                : "Create Teacher"}
            </button>
          </div>
        </form>
      </div>

      <ToastContainer />
    </div>
  );
}