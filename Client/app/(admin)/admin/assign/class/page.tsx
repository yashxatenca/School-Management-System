"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { classService } from "@/lib/admin_api/AdminClassService";
import { fetchTeachers } from "@/lib/admin_api/TeacherApi";
import {
    useAssignClassMutation,
    useGetAssignments,
    useDeleteAssignmentMutation
} from "@/lib/admin_api/ClassAssignmentApi";

interface Teacher {
    _id: string;
    name: string;
}

interface Class {
    _id: string;
    name: string;
    section: string;
}

export default function AssignClassDashboard() {

    // ================= STATE =================
    const [teacherId, setTeacherId] = useState("");
    const [classId, setClassId] = useState("");
    const [academicYear, setAcademicYear] = useState(new Date().getFullYear().toString());
    const [showTable, setShowTable] = useState(false);

    // ================= QUERIES =================
    const { data: teachers, isLoading: teacherLoading } = useQuery({
        queryKey: ["teachers"],
        queryFn: fetchTeachers,
    });

    const { data: classes, isLoading: classLoading } = useQuery({
        queryKey: ["classes"],
        queryFn: classService.getAll,
    });

    const {
        data: assignments = [], // 🔥 SAFE
        isLoading,
        isFetching,
        refetch
    } = useGetAssignments(showTable);

    // ================= MUTATIONS =================
    const assignMutation = useAssignClassMutation();
    const deleteMutation = useDeleteAssignmentMutation();

    // ================= HANDLERS =================

    const handleAssign = () => {
        if (!teacherId || !classId || !academicYear) {
            toast.warning("Fill all fields");
            return;
        }

        assignMutation.mutate(
            { teacherId, classId, academicYear },
            {
                onSuccess: () => {
                    toast.success("Assigned successfully 🎉");
                    setTeacherId("");
                    setClassId("");

                    setShowTable(true);
                    refetch();
                },
                onError: () => toast.error("Failed ❌"),
            }
        );
    };

    const handleDelete = (id: string) => {
        if (window.confirm("Delete this assignment?")) {
            deleteMutation.mutate(id, {
                onSuccess: () => {
                    toast.success("Deleted 🗑️");
                    refetch();
                },
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
                <h1 className="text-xl font-bold mb-6">Assign Class</h1>

                <div className="grid md:grid-cols-3 gap-6 mb-6">

                    <input
                        type="text"
                        value={academicYear}
                        onChange={(e) => setAcademicYear(e.target.value)}
                        className="border p-2 rounded"
                        placeholder="Academic Year"
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
                        value={classId}
                        onChange={(e) => setClassId(e.target.value)}
                        disabled={classLoading}
                        className="border p-2 rounded"
                    >
                        <option value="">
                            {classLoading ? "Loading..." : "Select Class"}
                        </option>

                        {classes?.data?.map((c: Class) => (
                            <option key={c._id} value={c._id}>
                                {c.name} - {c.section}
                            </option>
                        ))}
                    </select>
                </div>

                <button
                    onClick={handleAssign}
                    className="bg-indigo-600 text-white px-6 py-2 rounded"
                >
                    Assign
                </button>
            </section>

            {/* ================= TABLE ================= */}
            <section className="bg-white rounded-xl shadow">

                <div className="p-4 flex justify-between">
                    <h2 className="font-bold">Assignments</h2>

                    {!showTable && (
                        <button
                            onClick={handleLoadAssignments}
                            className="bg-black text-white px-4 py-2 rounded"
                        >
                            Load Assigned Classes
                        </button>
                    )}
                </div>

                {showTable && (
                    <div>
                        {(isLoading || isFetching) ? (
                            <p className="p-6 text-center">Loading...</p>
                        ) : (
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b">
                                        <th>Teacher</th>
                                        <th>Class</th>
                                        <th>Year</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {assignments.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="text-center p-4">
                                                No Data Found
                                            </td>
                                        </tr>
                                    ) : (
                                        assignments.map((item: any) => (
                                            <tr key={item._id} className="border-b text-center">
                                                <td>{item.teacherId?.name || "N/A"}</td>
                                                <td>
                                                    {item.classId?.name} - {item.classId?.section}
                                                </td>
                                                <td>{item.academicYear}</td>
                                                <td>
                                                    <button
                                                        onClick={() => handleDelete(item._id)}
                                                        className="text-red-500"
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}
            </section>
        </div>
    );
}