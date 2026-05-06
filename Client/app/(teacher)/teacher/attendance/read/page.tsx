"use client";

import React, { useState } from "react";
import { toast } from "react-toastify";

// 👇 Ye apka aane wala naya hook hoga jo API call karega
// import { useLazyGetAttendance } from "@/hooks/Teacher/useTeacherAttendance";

export default function ViewAttendancePage() {
    // UI States
    const [viewMode, setViewMode] = useState<"single" | "range">("single");

    // Date States
    const today = new Date().toISOString().split("T")[0];
    const [singleDate, setSingleDate] = useState<string>(today);
    const [startDate, setStartDate] = useState<string>(today);
    const [endDate, setEndDate] = useState<string>(today);

    // 🔥 JAB NAYA HOOK BANEGA TOH AISE USE KARENGEY:
    // const { fetchAttendance, isLoading, data } = useLazyGetAttendance();

    // Dummy states (Inko hata dena jab hook connect karo)
    const [isLoading, setIsLoading] = useState(false);
    const [attendanceRecords, setAttendanceRecords] = useState<any[]>([]);

    // ✅ BUTTON CLICK HANDLER
    const handleFetchClick = async (e: React.FormEvent) => {
        e.preventDefault();

        if (viewMode === "range" && startDate > endDate) {
            return toast.error("Start date cannot be after End date ❌");
        }

        // Payload banayenge conditions ke hisab se
        const payload = viewMode === "single"
            ? { date: singleDate }
            : { startDate, endDate };

        console.log("🔥 Fetching with payload:", payload);
        toast.info("Fetching attendance...");

        // 👉 YAHAN API CALL HOGI:
        // await fetchAttendance(payload);

        // Dummy loading animation dikhane ke liye (Ishe hata dena baad mein)
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            setAttendanceRecords([]); // Dummy empty data
            toast.success("Fetched successfully! (Dummy)");
        }, 1000);
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "P": return <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-sm font-medium">Present</span>;
            case "A": return <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-sm font-medium">Absent</span>;
            case "L": return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-sm font-medium">Late</span>;
            default: return status;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8 text-gray-800">
            <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-8">
                <h1 className="text-3xl font-bold mb-6 border-b pb-4">
                    View Class Attendance
                </h1>

                {/* CONTROLS SECTION */}
                <div className="mb-8 bg-gray-50 p-4 rounded-lg border">
                    {/* View Mode Toggle */}
                    <div className="flex gap-4 mb-4 border-b pb-4">
                        <button
                            type="button"
                            onClick={() => setViewMode("single")}
                            className={`px-4 py-2 rounded-md transition-colors ${viewMode === "single" ? "bg-blue-600 text-white shadow" : "bg-gray-200 text-gray-700"
                                }`}
                        >
                            Single Date
                        </button>
                        <button
                            type="button"
                            onClick={() => setViewMode("range")}
                            className={`px-4 py-2 rounded-md transition-colors ${viewMode === "range" ? "bg-blue-600 text-white shadow" : "bg-gray-200 text-gray-700"
                                }`}
                        >
                            Date Range
                        </button>
                    </div>

                    {/* FORM WITH BUTTON */}
                    <form onSubmit={handleFetchClick} className="flex items-end gap-6">
                        {viewMode === "single" ? (
                            <div className="flex-1 max-w-xs">
                                <label className="block font-semibold mb-2 text-sm text-gray-600">Select Date</label>
                                <input
                                    type="date"
                                    value={singleDate}
                                    onChange={(e) => setSingleDate(e.target.value)}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                        ) : (
                            <>
                                <div className="flex-1 max-w-xs">
                                    <label className="block font-semibold mb-2 text-sm text-gray-600">Start Date</label>
                                    <input
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div className="flex-1 max-w-xs">
                                    <label className="block font-semibold mb-2 text-sm text-gray-600">End Date</label>
                                    <input
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                            </>
                        )}

                        {/* 🔥 MAIN FETCH BUTTON 🔥 */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="bg-gray-800 text-black px-6 py-2 rounded-lg hover:bg-gray-900 transition-colors h-[42px] min-w-[140px] flex items-center justify-center font-medium shadow-sm disabled:opacity-50"
                        >
                            {isLoading ? "Searching..." : "Get Attendance"}
                        </button>
                    </form>
                </div>

                {/* TABLE SECTION */}
                <div className="overflow-x-auto border rounded-lg">
                    <table className="w-full text-left">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-3 border-b font-semibold">Date</th>
                                <th className="p-3 border-b font-semibold">Student Name</th>
                                <th className="p-3 border-b font-semibold text-center">Status</th>
                                <th className="p-3 border-b font-semibold">Remarks</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center">
                                        <div className="animate-pulse flex flex-col items-center">
                                            <div className="h-6 w-24 bg-gray-200 rounded mb-2"></div>
                                            <span className="text-gray-500 text-sm">Fetching from database...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : attendanceRecords.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="p-10 text-center text-gray-500 bg-gray-50">
                                        <div className="text-lg mb-1">No Data Yet</div>
                                        <div className="text-sm">Select dates and click "Get Attendance" to view records.</div>
                                    </td>
                                </tr>
                            ) : (
                                attendanceRecords.map((record) => (
                                    record.attendance.map((student: any) => (
                                        <tr key={`${record._id}-${student._id}`} className="border-b hover:bg-gray-50">
                                            <td className="p-3 text-sm text-gray-600">{record.date}</td>
                                            <td className="p-3 font-medium">{student.studentId?.name || "Unknown"}</td>
                                            <td className="p-3 text-center">
                                                {getStatusBadge(student.status)}
                                            </td>
                                            <td className="p-3 text-sm text-gray-600">
                                                {student.remarks || "-"}
                                            </td>
                                        </tr>
                                    ))
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}