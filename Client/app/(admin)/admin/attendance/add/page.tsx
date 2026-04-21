"use client";

import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useGetClasses } from "@/hooks/Admin/useClass";
import { useGetStudentsByClass } from "@/hooks/Admin/useStudent";
import { useMarkClassAttendance } from "@/hooks/Admin/useAttendance";

export default function MarkAttendance() {
    // Tabs: 'class' (Bulk) | 'single' (Specific Student)
    const [activeTab, setActiveTab] = useState<"class" | "single">("class");

    // Common State
    const [classId, setClassId] = useState("");
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

    // Bulk State
    const [attendanceArray, setAttendanceArray] = useState<any[]>([]);

    // Single Student State
    const [searchId, setSearchId] = useState("");
    const [singleStatus, setSingleStatus] = useState<"P" | "A" | "L">("P");
    const [singleRemarks, setSingleRemarks] = useState("");

    // ==========================================
    // DATA FETCHING (TanStack Queries)
    // ==========================================
    const { data: classesResponse, isLoading: isLoadingClasses } = useGetClasses();
    const classesList = classesResponse?.data || classesResponse || [];

    // Yeh query tabhi chalegi jab classId select hogi
    const { data: studentsResponse, isFetching } = useGetStudentsByClass(classId);

    const { mutate: submitAttendance, isPending } = useMarkClassAttendance();

    // ==========================================
    // EFFECT: Set local state safely without infinite loops
    // ==========================================
    useEffect(() => {
        // Array ko safely nikalna
        const list = studentsResponse?.data || studentsResponse || [];

        if (list && list.length > 0) {
            const formattedData = list.map((student: any) => ({
                // MongoDB ID (Backend ke liye)
                _id: student._id,
                name: student.name,
                // UI aur Search ke liye 6-digit ID (Agar rollNumber na ho)
                displayId: student.studentId || "-",
                status: "P",
                remarks: "",
            }));
            setAttendanceArray(formattedData);
        } else {
            setAttendanceArray([]);
        }
    }, [studentsResponse]); // Sirf tab chalega jab actual API response aayega

    // ==========================================
    // HANDLERS
    // ==========================================
    const handleBulkStatusChange = (student_id: string, status: "P" | "A" | "L") => {
        setAttendanceArray((prev) =>
            prev.map((s) => (s._id === student_id ? { ...s, status } : s))
        );
    };

    const handleBulkRemarksChange = (student_id: string, remarks: string) => {
        setAttendanceArray((prev) =>
            prev.map((s) => (s._id === student_id ? { ...s, remarks } : s))
        );
    };

    // 🚀 Submit Bulk Class (Matching Mongoose Schema)
    const handleSubmitClass = () => {
        if (!classId) return toast.error("Please select a class.");
        if (attendanceArray.length === 0) return toast.error("No students to mark.");

        const payload = {
            classId,
            date,
            attendanceArray: attendanceArray.map((a) => ({
                studentId: a._id, // 🔥 Exact match with your backend schema
                status: a.status,
                remarks: a.remarks,
            })),
        };

        submitAttendance(payload);
    };

    // 🚀 Submit Single Student (Matching Mongoose Schema)
    const handleSubmitSingle = (e: React.FormEvent) => {
        e.preventDefault();
        if (!classId) return toast.error("Please select a class first.");
        if (!searchId) return toast.error("Please enter Student ID / Roll No.");

        // Local array mein bacche ko 6-digit displayId se dhundo
        const student = attendanceArray.find(
            (s) => s.displayId === searchId
        );

        if (!student) {
            return toast.error("Student not found in the selected class.");
        }

        const payload = {
            classId,
            date,
            attendanceArray: [{
                studentId: student._id, // 🔥 Exact match with your backend schema
                status: singleStatus,
                remarks: singleRemarks,
            }],
        };

        submitAttendance(payload);

        // Form reset karein
        setSearchId("");
        setSingleRemarks("");
    };

    return (
        <div className="max-w-5xl mx-auto p-6 bg-gray-50 min-h-screen font-sans">
            <div className="mb-6">
                <h2 className="text-3xl font-bold text-gray-800">Mark Attendance</h2>
                <p className="text-gray-500 mt-1">Select a class to mark bulk attendance or update a specific student.</p>
            </div>

            {/* TABS CONTROLLER */}
            <div className="flex space-x-2 mb-6 bg-gray-200 p-1 rounded-xl max-w-sm">
                <button
                    onClick={() => setActiveTab("class")}
                    className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all ${activeTab === "class" ? "bg-white text-blue-700 shadow-sm" : "text-gray-600 hover:text-gray-900"
                        }`}
                >
                    📝 Entire Class
                </button>
                <button
                    onClick={() => setActiveTab("single")}
                    className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all ${activeTab === "single" ? "bg-white text-blue-700 shadow-sm" : "text-gray-600 hover:text-gray-900"
                        }`}
                >
                    👤 Specific Student
                </button>
            </div>

            {/* COMMON FILTERS (Class & Date) */}
            <div className="flex flex-wrap gap-4 mb-6 bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex-1 min-w-[200px]">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Select Class</label>
                    <select
                        value={classId}
                        onChange={(e) => setClassId(e.target.value)}
                        disabled={isLoadingClasses}
                        className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100"
                    >
                        <option value="">{isLoadingClasses ? "Loading classes..." : "-- Choose Class --"}</option>
                        {classesList.map((c: any) => (
                            <option key={c._id} value={c._id}>
                                {c.name} {c.section ? `- ${c.section}` : ""}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex-1 min-w-[200px]">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Date</label>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>
            </div>

            {/* ========================================== */}
            {/* VIEW 1: ENTIRE CLASS TAB */}
            {/* ========================================== */}
            {activeTab === "class" && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    {isFetching ? (
                        <div className="p-10 text-center text-blue-600 font-medium animate-pulse">
                            Fetching students...
                        </div>
                    ) : classId && attendanceArray.length === 0 ? (
                        <div className="p-10 text-center text-gray-500 bg-gray-50">
                            No students found in this class.
                        </div>
                    ) : attendanceArray.length > 0 ? (
                        <>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Student ID</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Student Name</th>
                                            <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase">Status</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Remarks (Opt)</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-100">
                                        {attendanceArray.map((student) => (
                                            <tr key={student._id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-600 font-medium">
                                                    {student.displayId}
                                                </td>
                                                <td className="px-6 py-3 whitespace-nowrap text-sm font-semibold text-gray-900">
                                                    {student.name}
                                                </td>
                                                <td className="px-6 py-3 whitespace-nowrap text-center">
                                                    <div className="inline-flex rounded-md shadow-sm border">
                                                        <button onClick={() => handleBulkStatusChange(student._id, "P")} className={`px-4 py-1.5 text-sm font-bold border-r ${student.status === "P" ? "bg-green-500 text-white" : "bg-white text-gray-600 hover:bg-gray-100"}`}>P</button>
                                                        <button onClick={() => handleBulkStatusChange(student._id, "L")} className={`px-4 py-1.5 text-sm font-bold border-r ${student.status === "L" ? "bg-yellow-500 text-white" : "bg-white text-gray-600 hover:bg-gray-100"}`}>L</button>
                                                        <button onClick={() => handleBulkStatusChange(student._id, "A")} className={`px-4 py-1.5 text-sm font-bold ${student.status === "A" ? "bg-red-500 text-white" : "bg-white text-gray-600 hover:bg-gray-100"}`}>A</button>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-3 whitespace-nowrap">
                                                    <input
                                                        type="text"
                                                        placeholder="Add reason..."
                                                        value={student.remarks}
                                                        onChange={(e) => handleBulkRemarksChange(student._id, e.target.value)}
                                                        className="w-full text-sm border border-gray-200 rounded-md p-1.5 focus:ring-2 focus:ring-blue-500 outline-none"
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="p-4 bg-gray-50 border-t">
                                <button
                                    onClick={handleSubmitClass}
                                    disabled={isPending}
                                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition disabled:bg-blue-400"
                                >
                                    {isPending ? "Saving..." : "Save Class Attendance"}
                                </button>
                            </div>
                        </>
                    ) : null}
                </div>
            )}

            {/* ========================================== */}
            {/* VIEW 2: SINGLE STUDENT TAB */}
            {/* ========================================== */}
            {activeTab === "single" && (
                <div className="max-w-xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <form onSubmit={handleSubmitSingle} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Student ID</label>
                            <input
                                type="text"
                                required
                                placeholder="Enter ID (e.g. 101749)"
                                value={searchId}
                                onChange={(e) => setSearchId(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                            <p className="text-xs text-gray-500 mt-1">Student must belong to the selected class above.</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                            <div className="flex gap-4">
                                <label className={`flex-1 flex justify-center py-3 rounded-lg border cursor-pointer ${singleStatus === 'P' ? 'bg-green-50 border-green-500 text-green-700 font-bold' : 'hover:bg-gray-50'}`}>
                                    <input type="radio" name="status" value="P" checked={singleStatus === 'P'} onChange={() => setSingleStatus("P")} className="hidden" />
                                    Present
                                </label>
                                <label className={`flex-1 flex justify-center py-3 rounded-lg border cursor-pointer ${singleStatus === 'L' ? 'bg-yellow-50 border-yellow-500 text-yellow-700 font-bold' : 'hover:bg-gray-50'}`}>
                                    <input type="radio" name="status" value="L" checked={singleStatus === 'L'} onChange={() => setSingleStatus("L")} className="hidden" />
                                    Late
                                </label>
                                <label className={`flex-1 flex justify-center py-3 rounded-lg border cursor-pointer ${singleStatus === 'A' ? 'bg-red-50 border-red-500 text-red-700 font-bold' : 'hover:bg-gray-50'}`}>
                                    <input type="radio" name="status" value="A" checked={singleStatus === 'A'} onChange={() => setSingleStatus("A")} className="hidden" />
                                    Absent
                                </label>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Remarks (Opt)</label>
                            <input
                                type="text"
                                placeholder="Reason..."
                                value={singleRemarks}
                                onChange={(e) => setSingleRemarks(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isPending}
                            className="w-full bg-gray-900 text-white py-3 rounded-lg font-bold hover:bg-black transition disabled:bg-gray-400"
                        >
                            {isPending ? "Updating..." : "Update Student"}
                        </button>
                    </form>
                </div>
            )}
            <ToastContainer />
        </div>
    );
}