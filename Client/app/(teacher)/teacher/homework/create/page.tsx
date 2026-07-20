"use client";

import { ToastContainer } from "react-toastify";
import { useState } from "react";
import { useGetTeacherAllClass } from "@/hooks/Teacher/useTeacherClass";
import { useGetSubject } from "@/hooks/Teacher/useTeacherSubject";
import { usecreateHowework } from "@/hooks/Teacher/useTeacherHomework";
import { toast } from "react-toastify";
export default function TeacherCreateHomeworkPage() {
  const { data, isLoading, error } = useGetTeacherAllClass();

  // Safe fallback
  const classes = data?.data?.data || [];
  const {
    data: SubjectData,
    isLoading: SubjectLoading,
    error: SubjectError,
  } = useGetSubject();
  const subjects = SubjectData?.data.result || [];
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    classId: "",
    subjectId: "",
    hasDueDate: true,
    dueDate: "",
    driveLink: "",
  });
  const { mutate: createHomework } = usecreateHowework();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createHomework(formData, {
      onSuccess: () => {
        setFormData({
          title: "",
          description: "",
          classId: "",
          subjectId: "",
          hasDueDate: true,
          dueDate: "",
          driveLink: "",
        });
        toast.success("Homework created successfully");
      },
      onError: () => {
        toast.error("Failed to create homework");
      },
    });
  };

  if (isLoading || SubjectLoading) {
    return <div className="p-5 text-center">Loading Classes...</div>;
  }
  if (SubjectError) {
    return (
      <div className="p-5 text-center text-red-500">
        Failed to load subjects
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-5 text-center text-red-500">Failed to load classes</div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md border border-gray-100">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Assign Homework</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Homework Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Homework Title
          </label>

          <input
            required
            type="text"
            placeholder="e.g., Chapter 5 Physics Numericals"
            className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            value={formData.title}
            onChange={(e) =>
              setFormData({
                ...formData,
                title: e.target.value,
              })
            }
          />
        </div>

        {/* Class & Subject */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Class */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Select Class
            </label>

            <select
              required
              className="mt-1 w-full p-2 border border-gray-300 rounded-md"
              value={formData.classId}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  classId: e.target.value,
                })
              }
            >
              <option value="">-- Choose Class --</option>

              {classes.map((c: any) => (
                <option key={c._id} value={c._id}>
                  {"Class " + c.name + " Section " + c.section}
                </option>
              ))}
            </select>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Select Subject
            </label>

            <select
              required
              className="mt-1 w-full p-2 border border-gray-300 rounded-md"
              value={formData.subjectId}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  subjectId: e.target.value,
                })
              }
            >
              <option value="">-- Choose Subject --</option>

              {subjects.map((s: any) => (
                <option key={s._id} value={s._id}>
                  {s.name + " (" + s.code + ")"}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Instructions / Description
          </label>

          <textarea
            required
            rows={4}
            placeholder="Solve all questions from page 42..."
            className="mt-1 w-full p-2 border border-gray-300 rounded-md"
            value={formData.description}
            onChange={(e) =>
              setFormData({
                ...formData,
                description: e.target.value,
              })
            }
          />
        </div>

        {/* Due Date */}
        <div className="flex flex-col md:flex-row md:items-center gap-4 p-3 bg-gray-50 rounded-lg border">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.hasDueDate}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  hasDueDate: e.target.checked,
                })
              }
              className="w-4 h-4 text-blue-600 rounded"
            />

            <span className="text-sm font-medium">Has Due Date?</span>
          </label>

          {formData.hasDueDate && (
            <input
              type="date"
              required
              className="p-2 border border-gray-300 rounded-md text-sm"
              value={formData.dueDate}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  dueDate: e.target.value,
                })
              }
            />
          )}
        </div>

        {/* Drive Link */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Google Drive Link (Optional)
          </label>

          <input
            type="url"
            placeholder="https://drive.google.com/..."
            className="mt-1 w-full p-2 border border-gray-300 rounded-md"
            value={formData.driveLink}
            onChange={(e) =>
              setFormData({
                ...formData,
                driveLink: e.target.value,
              })
            }
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Assign Homework
        </button>
      </form>

      <ToastContainer />
    </div>
  );
}
