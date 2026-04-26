"use client";

import React, { useState, useEffect } from "react";

// Updated Student interface to match UI needs
interface Student {
    _id: string; // Will map to studentId in backend
    rollNo: string;
    name: string;
    status: "Present" | "Absent" | "Late"; // Removed "Leave" to match Mongoose ["P", "A", "L"]
    remarks?: string;
}

export default function TeacherAttendancePage() {
    // 1. Store the actual Class ObjectId, not the display name
    const [selectedClassId, setSelectedClassId] = useState<string>("60d5ec49f1b2c8b1f8c8e1a1");
    const [date, setDate] = useState<string>(new Date().toISOString().split("T")[0]);
    const [students, setStudents] = useState<Student[]>([]);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    // Mock API Call
    useEffect(() => {
        const fetchStudents = async () => {
            // Replace with actual fetch: fetch(`/api/students?classId=${selectedClassId}`)
            const dummyStudents: Student[] = [
                { _id: "60d5ec49f1b2c8b1f8c8e2b1", rollNo: "101", name: "Aarav Sharma", status: "Present", remarks: "" },
                { _id: "60d5ec49f1b2c8b1f8c8e2b2", rollNo: "102", name: "Vihaan Singh", status: "Present", remarks: "" },
            ];
            setStudents(dummyStudents);
        };

        fetchStudents();
    }, [selectedClassId]);

    // Handle Status Change
    const handleStatusChange = (studentId: string, newStatus: Student["status"]) => {
        setStudents((prev) =>
            prev.map((student) =>
                student._id === studentId ? { ...student, status: newStatus } : student
            )
        );
    };

    // Optional: Handle Remarks Change (Since your schema supports it)
    const handleRemarksChange = (studentId: string, remarks: string) => {
        setStudents((prev) =>
            prev.map((student) =>
                student._id === studentId ? { ...student, remarks } : student
            )
        );
    }

    // Map UI Status to Mongoose Enum
    const getStatusEnum = (uiStatus: string): "P" | "A" | "L" => {
        switch (uiStatus) {
            case "Present": return "P";
            case "Absent": return "A";
            case "Late": return "L";
            default: return "P";
        }
    };

    // Handle Final Submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // 2. Format the payload EXACTLY as the backend expects (minus the auth fields)
        const attendancePayload = {
            classId: selectedClassId,
            date: date,
            attendance: students.map((s) => ({
                studentId: s._id,
                status: getStatusEnum(s.status),
                remarks: s.remarks || "",
            })),
        };

        try {
            console.log("Submitting structured payload to backend:", attendancePayload);
            // Example Request:
            // await axios.post('/api/attendance', attendancePayload, {
            //     headers: { Authorization: `Bearer ${token}` }
            // });

            alert("Attendance saved successfully!");
        } catch (error) {
            console.error("Failed to submit attendance:", error);
            alert("Error saving attendance. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">
                    Mark Daily Attendance
                </h1>

                <div className="flex flex-wrap gap-6 mb-8">
                    {/* Class Selection */}
                    <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-600 mb-2">
                            Select Class / Section
                        </label>
                        <select
                            value={selectedClassId}
                            onChange={(e) => setSelectedClassId(e.target.value)}
                            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {/* Use actual MongoDB ObjectIds as values */}
                            <option value="60d5ec49f1b2c8b1f8c8e1a1">Class 10 - A</option>
                            <option value="60d5ec49f1b2c8b1f8c8e1a2">Class 10 - B</option>
                        </select>
                    </div>

                    {/* Date Selection */}
                    <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-600 mb-2">
                            Date
                        </label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                {/* Attendance Form */}
                <form onSubmit={handleSubmit}>
                    <div className="overflow-x-auto mb-6">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-100 text-gray-600 text-sm">
                                    <th className="p-3 border-b">Roll No.</th>
                                    <th className="p-3 border-b">Student Name</th>
                                    <th className="p-3 border-b text-center">Attendance Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map((student) => (
                                    <tr key={student._id} className="border-b hover:bg-gray-50">
                                        <td className="p-3 font-medium text-gray-700">
                                            {student.rollNo}
                                        </td>
                                        <td className="p-3 text-gray-800">{student.name}</td>
                                        <td className="p-3">
                                            <div className="flex justify-center gap-4">
                                                {(["Present", "Absent", "Late"] as const).map(
                                                    (statusOption) => (
                                                        <label
                                                            key={statusOption}
                                                            className={`flex items-center gap-1 cursor-pointer px-3 py-1 rounded-full text-sm transition-colors ${student.status === statusOption
                                                                    ? statusOption === "Present"
                                                                        ? "bg-green-100 text-green-700 font-semibold"
                                                                        : statusOption === "Absent"
                                                                            ? "bg-red-100 text-red-700 font-semibold"
                                                                            : "bg-yellow-100 text-yellow-700 font-semibold"
                                                                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                                                                }`}
                                                        >
                                                            <input
                                                                type="radio"
                                                                name={`status-${student._id}`}
                                                                value={statusOption}
                                                                checked={student.status === statusOption}
                                                                onChange={() =>
                                                                    handleStatusChange(student._id, statusOption)
                                                                }
                                                                className="hidden"
                                                            />
                                                            {statusOption}
                                                        </label>
                                                    )
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {students.length === 0 && (
                                    <tr>
                                        <td colSpan={3} className="p-6 text-center text-gray-500">
                                            No students found for this class.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={isSubmitting || students.length === 0}
                            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            {isSubmitting ? "Saving..." : "Save Attendance"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}