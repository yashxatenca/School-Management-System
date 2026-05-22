"use client";

import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import { toast } from "react-toastify";
import {
  BookOpen,
  CheckCircle2,
  Edit2,
  X,
  Trash2,
  Users,
  GraduationCap,
  AlertCircle,
  Search,
} from "lucide-react";
import { useGetSubject } from "@/hooks/Teacher/useTeacherSubject";
import {
  useTeacherSubjectAssign,
  useTeacherSubjectAssignMutation,
  useTeacherSubjectAssignUpdateMutation,
  useTeacherSubjectAssignDeleteMutation,
} from "@/hooks/Teacher/useTeacherSubjectAssign";

const SubjectSkeleton = () => (
  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
    {[1, 2, 3, 4, 5, 6].map((i) => (
      <div key={i} className="h-16 bg-gray-200 animate-pulse rounded-xl" />
    ))}
  </div>
);

const TableSkeleton = () => (
  <div className="space-y-4">
    {[1, 2, 3].map((i) => (
      <div
        key={i}
        className="h-12 w-full bg-gray-100 animate-pulse rounded-lg"
      />
    ))}
  </div>
);

export default function AssignSubjectsPage() {
  const { user } = useSelector((state: RootState) => state.teacherauthstate);
  const { classId } = useSelector(
    (state: RootState) => state.teacherclassstate,
  );

  const teacherId = user?._id;

  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [isSearchClicked, setIsSearchClicked] = useState(false);

  const { data: subjectsData, isLoading: isSubjectsLoading } = useGetSubject();
  const {
    data: assignmentsData,
    isFetching: isAssignmentsLoading,
    refetch: refetchAssignments,
  } = useTeacherSubjectAssign(isSearchClicked);

  const createMutation = useTeacherSubjectAssignMutation();
  const updateMutation = useTeacherSubjectAssignUpdateMutation();
  const deleteMutation = useTeacherSubjectAssignDeleteMutation();

  const subjectsList = subjectsData?.data?.result || subjectsData || [];

  const rawAssignments =
    assignmentsData?.data?.data ||
    assignmentsData?.data ||
    assignmentsData ||
    [];
  const allAssignments = Array.isArray(rawAssignments) ? rawAssignments : [];

  const currentClassAssignments = allAssignments.filter(
    (assign: any) => (assign.classId?._id || assign.classId) === classId,
  );

  const toggleSubject = (subjectId: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(subjectId)
        ? prev.filter((id) => id !== subjectId)
        : [...prev, subjectId],
    );
  };

  const handleEditClick = (assignment: any) => {
    setEditId(assignment._id);
    const subjectIds = assignment.subjectId?.map((s: any) => s._id || s) || [];
    setSelectedSubjects(subjectIds);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditId(null);
    setSelectedSubjects([]);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this assignment?")) {
      try {
        await deleteMutation.mutateAsync(id);
        toast.success("Assignment deleted successfully!");
        refetchAssignments();
      } catch (error) {
        toast.error("Failed to delete assignment.");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!teacherId || !classId) {
      toast.error("Missing Class ID or Teacher ID");
      return;
    }

    const payload = {
      classId,
      classTeacherId: teacherId,
      subjectId: selectedSubjects,
    };

    try {
      if (editId) {
        await updateMutation.mutateAsync({ id: editId, data: payload });
        toast.success("Assignment updated successfully!");
      } else {
        await createMutation.mutateAsync(payload);
        toast.success("Subjects assigned successfully!");
      }

      if (!isSearchClicked) {
        setIsSearchClicked(true);
      } else {
        refetchAssignments();
      }
      cancelEdit();
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  if (!classId || !teacherId) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-gray-500 bg-gray-50">
        <AlertCircle className="w-12 h-12 text-amber-500 mb-4" />
        <h2 className="text-xl font-bold text-gray-800">No Class Selected</h2>
        <p>
          Please select a class from your dashboard first to assign subjects.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div
            className={`p-6 text-white ${editId ? "bg-amber-500" : "bg-blue-600"}`}
          >
            <div className="flex justify-between items-center">
              <h1 className="text-xl md:text-2xl font-bold flex items-center gap-2">
                <BookOpen className="w-6 h-6" />
                {editId ? "Update Subjects" : "Assign Subjects"}
              </h1>
              {editId && (
                <button
                  onClick={cancelEdit}
                  className="text-white hover:text-amber-100 flex items-center gap-1 text-sm font-medium border border-white/30 px-3 py-1 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" /> Cancel
                </button>
              )}
            </div>
            <div className="mt-4 flex flex-wrap gap-2 md:gap-4 text-xs md:text-sm font-medium opacity-90">
              <span className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full">
                <Users className="w-4 h-4" /> {user?.name || "Teacher"}
              </span>
              <span className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full">
                <GraduationCap className="w-4 h-4" /> Active Class
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-4 md:p-8 space-y-6">
            <div className="space-y-4">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-600" />
                Select Subjects
              </label>

              {isSubjectsLoading ? (
                <SubjectSkeleton />
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                  {subjectsList.map((subject: any) => {
                    const isSelected = selectedSubjects.includes(subject._id);
                    return (
                      <div
                        key={subject._id}
                        onClick={() => toggleSubject(subject._id)}
                        className={`cursor-pointer p-3 md:p-4 rounded-xl border-2 transition-all flex items-center justify-between
                                                    ${
                                                      isSelected
                                                        ? "border-blue-600 bg-blue-50 text-blue-800 shadow-sm"
                                                        : "border-gray-200 hover:border-blue-300 bg-white text-gray-600"
                                                    }`}
                      >
                        <span className="font-medium text-sm md:text-base">
                          {subject.name || subject.subjectName}
                        </span>
                        {isSelected && (
                          <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 ml-2" />
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-end gap-3 md:gap-4">
              {editId && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="px-4 py-2 md:px-6 md:py-3 text-gray-600 font-semibold hover:bg-gray-100 rounded-lg transition-all text-sm md:text-base"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={isSubmitting || selectedSubjects.length === 0}
                className={`font-semibold py-2 px-4 md:py-3 md:px-8 rounded-lg shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base ${
                  editId
                    ? "bg-amber-500 hover:bg-amber-600 text-gray-900"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                {isSubmitting
                  ? "Saving..."
                  : editId
                    ? "Update Subjects"
                    : "Save Subjects"}
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
            <h2 className="text-lg md:text-xl font-bold text-gray-800 flex items-center gap-2">
              Assignments
              {isSearchClicked && (
                <span className="text-xs md:text-sm bg-gray-100 text-gray-600 px-3 py-1 rounded-full font-medium">
                  {currentClassAssignments.length} Found
                </span>
              )}
            </h2>

            {!isSearchClicked && (
              <button
                onClick={() => setIsSearchClicked(true)}
                className="flex items-center gap-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 hover:text-indigo-700 font-semibold py-2 px-6 rounded-lg transition-all text-sm md:text-base w-full md:w-auto justify-center"
              >
                <Search className="w-4 h-4" /> Load Assignments
              </button>
            )}
          </div>

          {!isSearchClicked ? (
            <div className="text-center py-8 md:py-10 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
              <p className="text-sm md:text-base text-gray-500 font-medium">
                Click the button above to load existing assignments.
              </p>
            </div>
          ) : isAssignmentsLoading ? (
            <TableSkeleton />
          ) : currentClassAssignments.length === 0 ? (
            <div className="text-center py-8 md:py-10 border border-gray-100 rounded-xl bg-gray-50">
              <p className="text-sm md:text-base text-gray-500 font-medium">
                No subjects assigned to this class yet.
              </p>
            </div>
          ) : (
            <>
              {/* Desktop View */}
              <div className="hidden md:block border border-gray-200 rounded-xl overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="p-4 text-sm font-semibold text-gray-600">
                        Subjects Assigned
                      </th>
                      <th className="p-4 text-sm font-semibold text-gray-600 text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentClassAssignments.map((assign: any) => (
                      <tr
                        key={assign._id}
                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                      >
                        <td className="p-4">
                          <span className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full font-bold">
                            {assign.subjectId?.length || 0} Subjects
                          </span>
                        </td>
                        <td className="p-4 flex items-center justify-end gap-4">
                          <button
                            onClick={() => handleEditClick(assign)}
                            className="text-blue-600 hover:text-blue-800 flex items-center gap-1 font-medium transition-colors"
                          >
                            <Edit2 className="w-4 h-4" /> Edit
                          </button>
                          <button
                            onClick={() => handleDelete(assign._id)}
                            className="text-red-500 hover:text-red-700 flex items-center gap-1 font-medium transition-colors"
                            disabled={deleteMutation.isPending}
                          >
                            <Trash2 className="w-4 h-4" /> Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile View */}
              <div className="md:hidden space-y-3">
                {currentClassAssignments.map((assign: any) => (
                  <div
                    key={assign._id}
                    className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex justify-between items-center"
                  >
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-1">
                        Subjects Assigned
                      </p>
                      <span className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full font-bold">
                        {assign.subjectId?.length || 0} Subjects
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditClick(assign)}
                        className="p-2.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(assign._id)}
                        className="p-2.5 text-red-500 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
