"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import { subjectService } from "@/lib/Admin/AdminSubjectService";

import { useGetClasses } from "@/hooks/Admin/useClass";
import { useGetTeachers } from "@/hooks/Admin/useTeacher";

export default function SubjectPage() {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);

  // --- FETCH DATA ---
  const { data: response, isLoading } = useQuery({
    queryKey: ["subjects"],
    queryFn: subjectService.getAll,
  });

  const { data: classes } = useGetClasses();
  const { data: teachers } = useGetTeachers();
  const subjects = Array.isArray(response) ? response : response?.data || [];

  // Setup form with default values to handle optional fields cleanly
  const { register, handleSubmit, reset, setValue } = useForm({
    defaultValues: {
      name: "",
      code: "",
      description: "",
      teacherId: "",
      isActive: true,
    },
  });

  // --- MUTATIONS WITH TOASTS ---
  const createMutation = useMutation({
    mutationFn: subjectService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
      toast.success("Subject created successfully! 📚");
      reset();
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to create subject");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: any) => subjectService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
      toast.info("Subject updated! 📝");
      setEditingId(null);
      reset();
    },
    onError: () => toast.error("Update failed"),
  });

  const deleteMutation = useMutation({
    mutationFn: subjectService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
      toast.warn("Subject deleted");
    },
    onError: () => toast.error("Could not delete subject"),
  });

  const onSubmit = (data: any) => {
    // Clean up optional fields before sending to API
    const payload = { ...data };
    if (!payload.teacherId) delete payload.teacherId;
    if (!payload.description) delete payload.description;

    if (editingId) {
      updateMutation.mutate({ id: editingId, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleEdit = (sub: any) => {
    setEditingId(sub._id);
    setValue("name", sub.name);
    setValue("code", sub.code);
    setValue("description", sub.description || "");
    setValue("teacherId", sub.teacherId || "");
    setValue("isActive", sub.isActive !== false);
    toast.dark("Editing mode enabled");
  };

  const inputClasses =
    "p-2.5 border rounded-xl outline-none focus:border-indigo-500 w-full bg-white";

  if (isLoading)
    return (
      <div className="p-10 text-center animate-pulse text-gray-400">
        Loading...
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8">
      {/* FORM SECTION */}
      <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          {editingId ? "Edit Subject" : "Add New Subject"}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Row 1: Required Fields */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                Subject Name *
              </label>
              <input
                {...register("name")}
                placeholder="e.g. Mathematics"
                className={inputClasses}
                required
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                Subject Code *
              </label>
              <input
                {...register("code")}
                placeholder="e.g. MATH101"
                className={`${inputClasses} uppercase`}
                required
              />
            </div>
          </div>

          {/* Row 2: Optional Fields */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                Subject Teacher (Optional)
              </label>
              <select {...register("teacherId")} className={inputClasses}>
                <option value="">No Teacher Assigned</option>
                {teachers?.teachers.map((t: any) => (
                  <option key={t._id} value={t._id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                Description (Optional)
              </label>
              <input
                {...register("description")}
                placeholder="Brief details about the subject"
                className={inputClasses}
              />
            </div>
            <div className="flex items-center h-11 px-2">
              <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-700">
                <input
                  type="checkbox"
                  {...register("isActive")}
                  className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                />
                Subject is Active
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-indigo-700 transition"
            >
              {editingId ? "Update Subject" : "Save Subject"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  reset();
                }}
                className="bg-gray-100 text-gray-800 px-6 py-2.5 rounded-xl hover:bg-gray-200 transition"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      {/* GRID LIST */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.map((sub: any) => (
          <div
            key={sub._id}
            className={`bg-white p-6 rounded-2xl border shadow-sm hover:shadow-md transition ${!sub.isActive ? "border-red-200 bg-red-50/30" : "border-gray-100"}`}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded uppercase">
                    {sub.code}
                  </span>
                  {!sub.isActive && (
                    <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold">
                      INACTIVE
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-bold text-gray-900">{sub.name}</h3>

                {sub.description && (
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                    {sub.description}
                  </p>
                )}

                <div className="mt-3 pt-3 border-t border-gray-50 space-y-1 text-xs text-gray-500">
                  {sub.teacherId && (
                    <p>
                      Taught By:{" "}
                      <span className="font-medium text-gray-700">
                        {sub.teacherId.name
                          ? sub.teacherId.name
                          : "No Teacher Assigned"}
                      </span>
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-2 ml-4">
                <button
                  onClick={() => handleEdit(sub)}
                  className="text-xs text-amber-600 bg-amber-50 px-3 py-1 rounded hover:bg-amber-100 border border-amber-100 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    if (
                      confirm("Are you sure you want to delete this subject?")
                    )
                      deleteMutation.mutate(sub._id);
                  }}
                  className="text-xs text-red-600 bg-red-50 px-3 py-1 rounded hover:bg-red-100 border border-red-100 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </section>
      <ToastContainer />
    </div>
  );
}
