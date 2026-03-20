"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Note: Ensure these API services/hooks are created in your lib folder
import { fetchTeachers } from "@/lib/admin_api/TeacherApi";
import { subjectService } from "@/lib/admin_api/AdminSubjectService";
import {
    useAssignSubjectMutation,
    useGetSubjectAssignments,
    useDeleteSubjectAssignmentMutation
} from "@/lib/admin_api/subjectAssignmentApi";

interface Teacher {
    _id: string;
    name: string;
}

interface Subject {
    _id: string;
    name: string;
    code: string;
}

export default function AssignSubjectDashboard() {

    // ================= STATE =================
    const [teacherId, setTeacherId] = useState("");
    const [subjectId, setSubjectId] = useState("");
    const [academicYear, setAcademicYear] = useState(new Date().getFullYear().toString());
    const [showTable, setShowTable] = useState(false);

    // ================= QUERIES =================
    const { data: teachers, isLoading: teacherLoading } = useQuery({
        queryKey: ["teachers"],
        queryFn: fetchTeachers,
    });

    const { data: subjects, isLoading: subjectLoading } = useQuery({
        queryKey: ["subjects"],
        queryFn: subjectService.getAll,
    });

    const {
        data: assignments = [], // 🔥 SAFE
        isLoading,
        isFetching,
        refetch
    } = useGetSubjectAssignments(showTable);

    // ================= MUTATIONS =================
    const assignMutation = useAssignSubjectMutation();
    const deleteMutation = useDeleteSubjectAssignmentMutation();

    // ================= HANDLERS =================

    const handleAssign = () => {
        if (!teacherId || !subjectId || !academicYear) {
            toast.warning("Fill all fields");
            return;
        }

        assignMutation.mutate(
            { teacherId, subjectId, academicYear },
            {
                onSuccess: () => {
                    toast.success("Subject assigned successfully 🎉");
                    setTeacherId("");
                    setSubjectId("");

                    setShowTable(true);
                    refetch();
                },
                onError: (error: any) => {
                    toast.error(error?.response?.data?.message || "Failed to assign subject ❌");
                },
            }
        );
    };

    const handleDelete = (id: string) => {
        if (window.confirm("Delete this subject assignment?")) {
            deleteMutation.mutate(id, {
                onSuccess: () => {
                    toast.success("Deleted 🗑️");
                    refetch();
                },
                onError: () => toast.error("Failed to delete ❌"),
            });
        }
    };

    const handleLoadAssignments = () => {
        setShowTable(true);
        refetch();
    };

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-10">
            <ToastContainer autoClose={3000} />

            {/* ================= FORM ================= */}
            <section className="bg-white p-6 rounded-xl shadow">
                <h1 className="text-xl font-bold mb-6">Assign Subject to Teacher</h1>

                <div className="grid md:grid-cols-3 gap-6 mb-6">

                    <input
                        type="text"
                        value={academicYear}
                        onChange={(e) => setAcademicYear(e.target.value)}
                        className="border p-2 rounded"
                        placeholder="Academic Year (e.g., 2025-2026)"
                    />

                    <select
                        value={teacherId}
                        onChange={(e) => setTeacherId(e.target.value)}
                        disabled={teacherLoading}
                        className="border p-2 rounded"
                    >
                        <option value="">
                            {teacherLoading ? "Loading..." : "Select Teacher"}
                        </option>

                        {teachers?.teachers?.map((t: Teacher) => (
                            <option key={t._id} value={t._id}>
                                {t.name}
                            </option>
                        ))}
                    </select>

                    <select
                        value={subjectId}
                        onChange={(e) => setSubjectId(e.target.value)}
                        disabled={subjectLoading}
                        className="border p-2 rounded"
                    >
                        <option value="">
                            {subjectLoading ? "Loading..." : "Select Subject"}
                        </option>

                        {subjects?.data?.map((s: Subject) => (
                            <option key={s._id} value={s._id}>
                                {s.name} {s.code ? `(${s.code})` : ''}
                            </option>
                        ))}
                    </select>
                </div>

                <button
                    onClick={handleAssign}
                    disabled={assignMutation.isPending}
                    className={`px-6 py-2 rounded text-white ${assignMutation.isPending ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                >
                    {assignMutation.isPending ? 'Assigning...' : 'Assign'}
                </button>
            </section>

            {/* ================= TABLE ================= */}
            <section className="bg-white rounded-xl shadow">

                <div className="p-4 flex justify-between items-center">
                    <h2 className="font-bold">Current Subject Assignments</h2>

                    {!showTable && (
                        <button
                            onClick={handleLoadAssignments}
                            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
                        >
                            Load Assigned Subjects
                        </button>
                    )}
                </div>

                {showTable && (
                    <div>
                        {(isLoading || isFetching) ? (
                            <p className="p-6 text-center text-gray-500">Loading assignments...</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b bg-gray-50 text-center">
                                            <th className="p-4 font-semibold text-gray-600">Teacher</th>
                                            <th className="p-4 font-semibold text-gray-600">Subject</th>
                                            <th className="p-4 font-semibold text-gray-600">Academic Year</th>
                                            <th className="p-4 font-semibold text-gray-600">Action</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {assignments.length === 0 ? (
                                            <tr>
                                                <td colSpan={4} className="text-center p-6 text-gray-500">
                                                    No Subject Assignments Found
                                                </td>
                                            </tr>
                                        ) : (
                                            assignments.map((item: any) => (
                                                <tr key={item._id} className="border-b hover:bg-gray-50 text-center transition-colors">
                                                    <td className="p-4">{item.teacherId?.name || "N/A"}</td>
                                                    <td className="p-4">
                                                        {item.subjectId?.name} {item.subjectId?.code ? `(${item.subjectId?.code})` : ''}
                                                    </td>
                                                    <td className="p-4">{item.academicYear}</td>
                                                    <td className="p-4">
                                                        <button
                                                            onClick={() => handleDelete(item._id)}
                                                            className="text-red-500 hover:text-red-700 font-medium"
                                                        >
                                                            Delete
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
                )}
            </section>
        </div>
    );
}