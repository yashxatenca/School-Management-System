"use client";

import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import { toast } from "react-toastify";
import { BookOpen, CheckCircle2, Edit2, X, Trash2, Users, GraduationCap, AlertCircle, Search } from "lucide-react";

// 🚀 React Query Hooks
import { useGetSubject } from "@/hooks/Teacher/useTeacherSubject";
import {
    useTeacherSubjectAssign,
    useTeacherSubjectAssignMutation,
    useTeacherSubjectAssignUpdateMutation,
    useTeacherSubjectAssignDeleteMutation
} from "@/hooks/Teacher/useTeacherSubjectAssign";

// --- SKELETON COMPONENTS ---
const SubjectSkeleton = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-16 bg-gray-200 animate-pulse rounded-xl"></div>
        ))}
    </div>
);
const TableSkeleton = () => (
    <div className="space-y-4">
        {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 w-full bg-gray-100 animate-pulse rounded-lg"></div>
        ))}
    </div>
);

export default function AssignSubjectsPage() {
    // 🎯 Redux State
    const { user } = useSelector((state: RootState) => state.teacherauthstate);
    const { classId } = useSelector((state: RootState) => state.teacherclassstate);

    const teacherId = user?._id;

    // Form & Search States
    const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
    const [editId, setEditId] = useState<string | null>(null);
    const [isSearchClicked, setIsSearchClicked] = useState(false); // 👈 Naya state search control ke liye

    // 🚀 API Hooks
    const { data: subjectsData, isLoading: isSubjectsLoading } = useGetSubject();

    // 👇 Yahan `isSearchClicked` pass kiya, toh page load par fetch nahi hoga
    const { data: assignmentsData, isFetching: isAssignmentsLoading, refetch: refetchAssignments } = useTeacherSubjectAssign(isSearchClicked);

    // 🛠️ Mutations
    const createMutation = useTeacherSubjectAssignMutation();
    const updateMutation = useTeacherSubjectAssignUpdateMutation();
    const deleteMutation = useTeacherSubjectAssignDeleteMutation();

    const subjectsList = subjectsData?.data.result || subjectsData || [];

    // Filter assignments for current class
    const allAssignments = assignmentsData?.data || assignmentsData || [];
    const currentClassAssignments = allAssignments.filter((assign: any) =>
        (assign.classId?._id || assign.classId) === classId
    );

    const toggleSubject = (subjectId: string) => {
        setSelectedSubjects((prev) =>
            prev.includes(subjectId)
                ? prev.filter((id) => id !== subjectId)
                : [...prev, subjectId]
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
            toast.error("Missing Class ID or Teacher ID from Redux!");
            return;
        }

        const payload = {
            classId: classId,
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
            // Agar pehle se list open hai toh usko refresh karo, warna list load kar do
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

    const handleSearch = () => {
        setIsSearchClicked(true);
    };

    const isSubmitting = createMutation.isPending || updateMutation.isPending;

    if (!classId || !teacherId) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-gray-500 bg-gray-50">
                <AlertCircle className="w-12 h-12 text-amber-500 mb-4" />
                <h2 className="text-xl font-bold text-gray-800">No Class Selected</h2>
                <p>Please select a class from your dashboard first to assign subjects.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-4xl mx-auto space-y-8">

                {/* 📝 TOP FORM SECTION (Same as before) */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className={`p-6 text-white ${editId ? 'bg-amber-500' : 'bg-blue-600'}`}>
                        <div className="flex justify-between items-center">
                            <h1 className="text-2xl font-bold flex items-center gap-2">
                                <BookOpen className="w-6 h-6" />
                                {editId ? "Update Subjects for this Class" : "Assign Subjects to this Class"}
                            </h1>
                            {editId && (
                                <button onClick={cancelEdit} className="text-white hover:text-amber-100 flex items-center gap-1 text-sm font-medium border border-white/30 px-3 py-1 rounded-lg">
                                    <X className="w-4 h-4" /> Cancel Edit
                                </button>
                            )}
                        </div>
                        <div className="mt-4 flex gap-4 text-sm font-medium opacity-90">
                            <span className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full">
                                <Users className="w-4 h-4" /> {user?.name || "Teacher"}
                            </span>
                            <span className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full">
                                <GraduationCap className="w-4 h-4" /> Active Class Context
                            </span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
                        <div className="space-y-4">
                            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                <BookOpen className="w-4 h-4 text-blue-600" />
                                Select Subjects for this Class
                            </label>

                            {isSubjectsLoading ? (
                                <SubjectSkeleton />
                            ) : (
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {subjectsList.map((subject: any) => {
                                        const isSelected = selectedSubjects.includes(subject._id);
                                        return (
                                            <div
                                                key={subject._id}
                                                onClick={() => toggleSubject(subject._id)}
                                                className={`cursor-pointer p-4 rounded-xl border-2 transition-all flex items-center justify-between
                                                    ${isSelected
                                                        ? "border-blue-600 bg-blue-50 text-blue-800 shadow-sm"
                                                        : "border-gray-200 hover:border-blue-300 bg-white text-gray-600"
                                                    }`}
                                            >
                                                <span className="font-medium">{subject.name || subject.subjectName}</span>
                                                {isSelected && <CheckCircle2 className="w-5 h-5 text-blue-600" />}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        <div className="pt-4 border-t border-gray-100 flex justify-end gap-4">
                            {editId && (
                                <button type="button" onClick={cancelEdit} className="px-6 py-3 text-gray-600 font-semibold hover:bg-gray-100 rounded-lg transition-all">
                                    Cancel
                                </button>
                            )}
                            <button
                                type="submit"
                                disabled={isSubmitting || selectedSubjects.length === 0}
                                className={`${editId ? 'bg-amber-500 hover:bg-amber-600' : 'bg-blue-600 hover:bg-blue-700'} text-white font-semibold py-3 px-8 rounded-lg shadow-md transition-all disabled:opacity-50`}
                            >
                                {isSubmitting ? "Saving..." : editId ? "Update Subjects" : "Save Assigned Subjects"}
                            </button>
                        </div>
                    </form>
                </div>

                {/* 📋 BOTTOM LIST SECTION (Search & Table) */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
                        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                            Assignments for Current Class
                            {isSearchClicked && (
                                <span className="text-sm bg-gray-100 text-gray-600 px-3 py-1 rounded-full font-medium">
                                    {currentClassAssignments.length} Found
                                </span>
                            )}
                        </h2>

                        {/* 👇 Search Button */}
                        {!isSearchClicked && (
                            <button
                                onClick={handleSearch}
                                className="flex items-center gap-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 hover:text-indigo-700 font-semibold py-2 px-6 rounded-lg transition-all"
                            >
                                <Search className="w-4 h-4" /> Load Assigned Subjects
                            </button>
                        )}
                    </div>

                    {!isSearchClicked ? (
                        <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
                            <p className="text-gray-500 font-medium">Click the button above to load existing assignments.</p>
                        </div>
                    ) : isAssignmentsLoading ? (
                        <TableSkeleton />
                    ) : (
                        <div className="border border-gray-200 rounded-xl overflow-hidden overflow-x-auto">
                            <table className="w-full text-left border-collapse min-w-[600px]">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-200">
                                        <th className="p-4 text-sm font-semibold text-gray-600">Subjects Assigned</th>
                                        <th className="p-4 text-sm font-semibold text-gray-600 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentClassAssignments.length === 0 ? (
                                        <tr>
                                            <td colSpan={2} className="p-8 text-center text-gray-500 font-medium">
                                                No subjects assigned to this class yet.
                                            </td>
                                        </tr>
                                    ) : (
                                        currentClassAssignments.map((assign: any) => (
                                            <tr key={assign._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                                <td className="p-4 text-gray-600">
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
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}