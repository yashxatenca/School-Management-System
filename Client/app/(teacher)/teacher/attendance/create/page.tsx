"use client";

import React, { useState, useEffect } from "react";
import { Student } from "../interface";
import { useGetStudentAttendance } from "@/hooks/Teacher/useTeacherAttendance";
import { useCreateAttendance } from "@/hooks/Teacher/useTeacherAttendance";
import { toast } from "react-toastify";

export default function TeacherAttendancePage() {
    const [date, setDate] = useState<string>(
        new Date().toISOString().split("T")[0]
    );
    const [students, setStudents] = useState<Student[]>([]);

    const { data: StudentsData, isLoading } = useGetStudentAttendance();
    const { mutate, isPending } = useCreateAttendance();

    // ✅ Load students
    useEffect(() => {
        if (StudentsData?.data) {
            const formatted = StudentsData.data.map((student: any) => ({
                ...student,
                status: student.status || "Present",
                remarks: student.remarks || "",
            }));
            setStudents(formatted);
        }
    }, [StudentsData]);

    // ✅ Status change
    const handleStatusChange = (
        studentId: string,
        newStatus: Student["status"]
    ) => {
        setStudents((prev) =>
            prev.map((s) =>
                s._id === studentId ? { ...s, status: newStatus } : s
            )
        );
    };

    // ✅ Remarks change
    const handleRemarksChange = (studentId: string, text: string) => {
        setStudents((prev) =>
            prev.map((s) =>
                s._id === studentId ? { ...s, remarks: text } : s
            )
        );
    };

    // ✅ Convert UI → DB enum
    const getMongooseEnum = (uiStatus: string): "P" | "A" | "L" => {
        switch (uiStatus) {
            case "Present":
                return "P";
            case "Absent":
                return "A";
            case "Late":
                return "L";
            default:
                return "P";
        }
    };

    // ✅ SUBMIT (HOOK BASED 🔥)
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!StudentsData?.data?.length) {
            return toast.warning("No students found ⚠️");
        }

        const classId = StudentsData.data[0]?.classId;

        if (!classId) {
            return toast.error("Class ID missing ❌");
        }

        const payload = {
            classId,
            date,
            attendance: students.map((s) => ({
                studentId: s._id,
                status: getMongooseEnum(s.status),
                remarks: s.remarks.trim(),
            })),
        };
        mutate(payload); // 🔥 API CALL HERE
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8 text-gray-800">
            <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-8">
                <h1 className="text-3xl font-bold mb-6 border-b pb-4">
                    Mark Daily Attendance
                </h1>

                {/* DATE */}
                <div className="mb-6">
                    <label className="block font-semibold mb-2">Date</label>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="px-4 py-2 border rounded-lg"
                    />
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="overflow-x-auto border rounded-lg">
                        <table className="w-full">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="p-3">ID</th>
                                    <th className="p-3">Name</th>
                                    <th className="p-3 text-center">
                                        Status
                                    </th>
                                    <th className="p-3">Remarks</th>
                                </tr>
                            </thead>

                            <tbody>
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={4} className="p-6 text-center">
                                            Loading students...
                                        </td>
                                    </tr>
                                ) : students.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="p-6 text-center">
                                            No students found
                                        </td>
                                    </tr>
                                ) : (
                                    students.map((student) => (
                                        <tr key={student._id} className="border-t">
                                            <td className="p-3">
                                                {student.studentId}
                                            </td>
                                            <td className="p-3">
                                                {student.name}
                                            </td>

                                            {/* STATUS */}
                                            <td className="p-3">
                                                <div className="flex justify-center gap-2">
                                                    {[
                                                        "Present",
                                                        "Late",
                                                        "Absent",
                                                    ].map((status) => {
                                                        const active =
                                                            student.status === status;

                                                        return (
                                                            <button
                                                                type="button"
                                                                key={status}
                                                                onClick={() =>
                                                                    handleStatusChange(
                                                                        student._id,
                                                                        status as Student["status"]
                                                                    )
                                                                }
                                                                className={`px-3 py-1 rounded border text-sm ${active
                                                                    ? "bg-blue-600 text-white"
                                                                    : "bg-gray-100"
                                                                    }`}
                                                            >
                                                                {status}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </td>

                                            {/* REMARKS */}
                                            <td className="p-3">
                                                <input
                                                    type="text"
                                                    value={student.remarks}
                                                    onChange={(e) =>
                                                        handleRemarksChange(
                                                            student._id,
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-full px-2 py-1 border rounded"
                                                />
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* SUBMIT */}
                    <div className="flex justify-end mt-6">
                        <button
                            type="submit"
                            disabled={
                                isPending ||
                                isLoading ||
                                students.length === 0
                            }
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg"
                        >
                            {isPending ? "Saving..." : "Save Attendance"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}