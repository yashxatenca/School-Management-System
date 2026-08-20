"use client";

import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import {
  useGetClasses,
  useGetStudentsByClass,
  useBulkUpdateStudents,
} from "@/lib/Admin/AdminStudentApi";
import { useGetTeachers } from "@/hooks/Admin/useTeacher";

type UpdateMode = "class" | "teacher";

export default function AdminBulkStudentUpdate() {
  // Source Class State
  const [sourceClassId, setSourceClassId] = useState<string>("");
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);

  // Update Config State
  const [activeMode, setActiveMode] = useState<UpdateMode>("class");
  const [targetClassId, setTargetClassId] = useState<string>("");
  const [targetTeacherId, setTargetTeacherId] = useState<string>("");

  // Queries & Mutations
  const { data: classesResponse, isLoading: isClassesLoading } =
    useGetClasses();
  const { data: teachersResponse, isLoading: isTeachersLoading } =
    useGetTeachers();

  const { data: classStudentsData, isFetching: isStudentsLoading } =
    useGetStudentsByClass(sourceClassId);

  const bulkUpdateMutation = useBulkUpdateStudents();

  const studentsList: any[] = Array.isArray(classStudentsData)
    ? classStudentsData
    : [];

  // --- Multi-Select Handlers ---
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedStudentIds(studentsList.map((s) => s._id));
    } else {
      setSelectedStudentIds([]);
    }
  };

  const handleToggleStudent = (id: string) => {
    setSelectedStudentIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  // --- Bulk Submit Handler ---
  const handleExecuteBulkUpdate = async () => {
    if (selectedStudentIds.length === 0) {
      toast.warn("Please select at least one student.");
      return;
    }

    if (activeMode === "class" && !targetClassId) {
      toast.warn("Please select a target class to move students into.");
      return;
    }

    if (activeMode === "teacher" && !targetTeacherId) {
      toast.warn("Please select a target teacher to assign.");
      return;
    }

    if (activeMode === "class" && targetClassId === sourceClassId) {
      toast.warn("Target class must be different from the source class.");
      return;
    }

    const payload = {
      studentIds: selectedStudentIds,
      ...(activeMode === "class" ? { classId: targetClassId } : {}),
      ...(activeMode === "teacher" ? { teacherId: targetTeacherId } : {}),
    };

    try {
      await bulkUpdateMutation.mutateAsync(payload);
      toast.success(
        `Successfully updated ${selectedStudentIds.length} student(s)!`,
      );
      setSelectedStudentIds([]);
      if (activeMode === "class") setTargetClassId("");
      if (activeMode === "teacher") setTargetTeacherId("");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to perform bulk update.",
      );
    }
  };

  const allSelected =
    studentsList.length > 0 &&
    selectedStudentIds.length === studentsList.length;

  return (
    <div className="p-6 max-w-7xl mx-auto bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Bulk Student Assignment
        </h1>
        <p className="text-gray-600 text-sm mt-1">
          Select a class to view its students, then bulk update their assigned
          class or teacher.
        </p>
      </div>

      {/* Step 1: Source Selection & Action Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Source Class Picker */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            1. Select Source Class
          </label>
          <select
            value={sourceClassId}
            onChange={(e) => {
              setSourceClassId(e.target.value);
              setSelectedStudentIds([]);
            }}
            className="w-full p-2.5 border border-gray-300 rounded-lg bg-white outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">
              {isClassesLoading
                ? "Loading classes..."
                : "-- Choose Source Class --"}
            </option>
            {classesResponse?.data?.map((cls: any) => (
              <option key={cls._id} value={cls._id}>
                {cls.name} - {cls.section}
              </option>
            ))}
          </select>
        </div>

        {/* Action Panel: Choose Target Update Type */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            2. Choose Bulk Action
          </label>

          {/* Mode Switcher Tabs */}
          <div className="flex gap-4 mb-4 border-b border-gray-200 pb-3">
            <button
              type="button"
              onClick={() => setActiveMode("class")}
              className={`pb-2 px-1 text-sm font-medium transition-colors ${
                activeMode === "class"
                  ? "border-b-2 border-blue-600 text-blue-600 font-semibold"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              Update Class
            </button>
            <button
              type="button"
              onClick={() => setActiveMode("teacher")}
              className={`pb-2 px-1 text-sm font-medium transition-colors ${
                activeMode === "teacher"
                  ? "border-b-2 border-blue-600 text-blue-600 font-semibold"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              Assign Teacher
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-center">
            {activeMode === "class" ? (
              <div className="flex-1 w-full">
                <select
                  value={targetClassId}
                  onChange={(e) => setTargetClassId(e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-lg bg-white outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Select Target Class --</option>
                  {classesResponse?.data?.map((cls: any) => (
                    <option key={cls._id} value={cls._id}>
                      {cls.name} - {cls.section}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="flex-1 w-full">
                <select
                  value={targetTeacherId}
                  onChange={(e) => setTargetTeacherId(e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-lg bg-white outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">
                    {isTeachersLoading
                      ? "Loading teachers..."
                      : "-- Select Target Teacher --"}
                  </option>
                  {teachersResponse.teachers?.map((teacher: any) => (
                    <option key={teacher._id} value={teacher._id}>
                      {teacher.name} ({teacher.email})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button
              type="button"
              onClick={handleExecuteBulkUpdate}
              disabled={
                bulkUpdateMutation.isPending || selectedStudentIds.length === 0
              }
              className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors whitespace-nowrap"
            >
              {bulkUpdateMutation.isPending
                ? "Updating..."
                : `Apply to (${selectedStudentIds.length}) Students`}
            </button>
          </div>
        </div>
      </div>

      {/* Step 3: Students Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <span className="text-sm font-medium text-gray-700">
            Selected:{" "}
            <strong className="text-blue-600">
              {selectedStudentIds.length}
            </strong>{" "}
            of {studentsList.length}
          </span>
        </div>

        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={handleSelectAll}
                  disabled={studentsList.length === 0}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Student ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Full Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Current Class
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Assigned Teacher
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {studentsList.length > 0 ? (
              studentsList.map((item) => {
                const isChecked = selectedStudentIds.includes(item._id);
                return (
                  <tr
                    key={item._id}
                    className={`hover:bg-gray-50 transition-colors ${
                      isChecked ? "bg-blue-50/40" : ""
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleToggleStudent(item._id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-600">
                      {item.studentId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                      {item.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {item.classId?.name}{" "}
                      {item.classId?.section ? `- ${item.classId.section}` : ""}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {item.teacherId?.name
                        ? item.teacherId.name.toUpperCase()
                        : "Unassigned"}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-12 text-center text-gray-500"
                >
                  {isStudentsLoading ? (
                    <span className="animate-pulse">Loading students...</span>
                  ) : sourceClassId ? (
                    "No students found in this class."
                  ) : (
                    "Please select a source class above to display students."
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <ToastContainer position="bottom-right" />
    </div>
  );
}
