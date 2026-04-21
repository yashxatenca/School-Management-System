"use client";
import React, { useState } from "react";
import { useGetClasses } from "@/hooks/Admin/useClass";
import { ToastContainer, toast } from "react-toastify";
import { useGetClassAttendance } from "@/hooks/Admin/useAttendance";
import { Calendar, Users, Loader2, CheckCircle, XCircle, AlertCircle, Search } from 'lucide-react';

export default function ViewAttendance() {
    // Aaj ki date default set kar rahe hain (YYYY-MM-DD format)
    const today = new Date().toISOString().split("T")[0];

    const [selectedClassId, setSelectedClassId] = useState("");
    const [selectedDate, setSelectedDate] = useState(today);

    // 1. Fetching all classes for the dropdown
    const { data: classes, isLoading: isClassesLoading } = useGetClasses();

    // Safety check for classes array
    const classList = Array.isArray(classes) ? classes : (classes?.data || []);

    // 2. Fetching attendance records based on Class & Date
    const { data: attendanceRecord, isLoading: isAttendanceLoading, isError } = useGetClassAttendance(
        selectedClassId,
        selectedDate,
        { enabled: !!selectedClassId } // Tabhi API call hogi jab class select hogi
    );

    // Backend response se student array nikalna (Aapke backend mein 'attendance' array hota hai andar)
    // Hum assume kar rahe hain ki ek din ka ek hi document aayega list mein.
    const attendanceList = attendanceRecord?.[0]?.attendance || attendanceRecord?.data?.[0]?.attendance || [];

    // Calculated Stats
    const totalStudents = attendanceList.length;
    const presentCount = attendanceList.filter((s: any) => s.status === 'P').length;
    const absentCount = attendanceList.filter((s: any) => s.status === 'A').length;
    const leaveCount = attendanceList.filter((s: any) => s.status === 'L').length;

    return (
        <div className="p-4 md:p-6 max-w-6xl mx-auto space-y-6">

            {/* Page Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-xl md:text-2xl font-bold flex items-center gap-2 text-gray-800 dark:text-white">
                    <Search className="text-indigo-600" /> View Class Attendance
                </h1>
            </div>

            {/* Filters (Date & Class) */}
            <div className="bg-white dark:bg-gray-900 p-4 md:p-6 rounded-2xl shadow-sm border flex flex-col md:flex-row gap-4 items-start md:items-end">
                <div className="w-full md:flex-1">
                    <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-300">Select Date</label>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-3.5 text-gray-400" size={18} />
                        <input
                            type="date"
                            value={selectedDate}
                            max={today}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="pl-10 w-full p-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 dark:bg-gray-800 dark:border-gray-700"
                        />
                    </div>
                </div>
                <div className="w-full md:flex-1">
                    <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-300">Select Class</label>
                    {isClassesLoading ? (
                        <div className="w-full p-2.5 border rounded-xl bg-gray-50 dark:bg-gray-800 dark:border-gray-700 text-gray-500 flex items-center gap-2">
                            <Loader2 className="animate-spin" size={16} /> Loading...
                        </div>
                    ) : (
                        <select
                            value={selectedClassId}
                            onChange={(e) => setSelectedClassId(e.target.value)}
                            className="w-full p-2.5 border rounded-xl bg-gray-50 dark:bg-gray-800 dark:border-gray-700 outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="">-- Choose a Class --</option>
                            {classList.map((cls: any) => (
                                <option key={cls._id || cls.id} value={cls._id || cls.id}>
                                    {cls.name} {cls.section ? `- Section ${cls.section}` : ""}
                                </option>
                            ))}
                        </select>
                    )}
                </div>
            </div>

            {/* Content Area */}
            {selectedClassId && (
                <div className="space-y-6">
                    {/* Loading State */}
                    {isAttendanceLoading && (
                        <div className="flex justify-center py-20 bg-white dark:bg-gray-900 rounded-2xl border dark:border-gray-800">
                            <Loader2 className="animate-spin text-indigo-600 h-10 w-10" />
                        </div>
                    )}

                    {/* Error State */}
                    {isError && (
                        <div className="text-center py-10 text-red-500 bg-white dark:bg-gray-900 rounded-2xl border dark:border-gray-800">
                            Failed to load attendance data.
                        </div>
                    )}

                    {/* Empty State */}
                    {!isAttendanceLoading && !isError && attendanceList.length === 0 && (
                        <div className="text-center py-16 text-gray-500 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border dark:border-gray-800">
                            <Users size={48} className="mx-auto text-gray-300 mb-4" />
                            <p className="text-lg font-medium">No attendance record found.</p>
                            <p className="text-sm">Attendance hasn't been marked for this class on {selectedDate}.</p>
                        </div>
                    )}

                    {/* Main Data View */}
                    {!isAttendanceLoading && !isError && attendanceList.length > 0 && (
                        <>
                            {/* Quick Stats Cards */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="bg-white dark:bg-gray-900 p-4 md:p-5 rounded-2xl border dark:border-gray-800 shadow-sm text-center">
                                    <p className="text-xs md:text-sm text-gray-500 font-semibold mb-1">Total</p>
                                    <p className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100">{totalStudents}</p>
                                </div>
                                <div className="bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800/50 p-4 md:p-5 rounded-2xl shadow-sm text-center">
                                    <p className="text-xs md:text-sm text-green-600 dark:text-green-400 font-semibold mb-1">Present</p>
                                    <p className="text-2xl md:text-3xl font-bold text-green-700 dark:text-green-500">{presentCount}</p>
                                </div>
                                <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/50 p-4 md:p-5 rounded-2xl shadow-sm text-center">
                                    <p className="text-xs md:text-sm text-red-600 dark:text-red-400 font-semibold mb-1">Absent</p>
                                    <p className="text-2xl md:text-3xl font-bold text-red-700 dark:text-red-500">{absentCount}</p>
                                </div>
                                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-100 dark:border-yellow-800/50 p-4 md:p-5 rounded-2xl shadow-sm text-center">
                                    <p className="text-xs md:text-sm text-yellow-600 dark:text-yellow-400 font-semibold mb-1">Leave</p>
                                    <p className="text-2xl md:text-3xl font-bold text-yellow-700 dark:text-yellow-500">{leaveCount}</p>
                                </div>
                            </div>

                            {/* Attendance Table */}
                            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border dark:border-gray-800 overflow-hidden">
                                <div className="px-4 md:px-6 py-4 border-b dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
                                    <h3 className="font-bold text-gray-700 dark:text-gray-200">Attendance Record</h3>
                                    <span className="text-sm text-gray-500 font-medium">{selectedDate}</span>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm min-w-[600px]">
                                        <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-300">
                                            <tr>
                                                <th className="p-4 border-b dark:border-gray-800 font-semibold whitespace-nowrap">StudentId</th>
                                                <th className="p-4 border-b dark:border-gray-800 font-semibold">Student Name</th>
                                                <th className="p-4 border-b dark:border-gray-800 font-semibold">Status</th>
                                                <th className="p-4 border-b dark:border-gray-800 font-semibold">Remarks</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                            {console.log(attendanceList)}
                                            {
                                                attendanceList.map((record: any) => {
                                                    const student = record.studentId || {};
                                                    return (
                                                        <tr key={student._id || record._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                                                            <td className="p-4 font-medium text-gray-600 dark:text-gray-400">
                                                                {student.studentId || "N/A"}
                                                            </td>
                                                            <td className="p-4 font-semibold text-gray-800 dark:text-gray-200">
                                                                {student.name || "Unknown"}
                                                            </td>
                                                            <td className="p-4">
                                                                {record.status === 'P' && (
                                                                    <span className="inline-flex items-center gap-1.5 text-green-700 bg-green-100 dark:bg-green-900/30 dark:text-green-400 px-3 py-1 rounded-full font-bold text-xs">
                                                                        <CheckCircle size={14} /> Present
                                                                    </span>
                                                                )}
                                                                {record.status === 'A' && (
                                                                    <span className="inline-flex items-center gap-1.5 text-red-700 bg-red-100 dark:bg-red-900/30 dark:text-red-400 px-3 py-1 rounded-full font-bold text-xs">
                                                                        <XCircle size={14} /> Absent
                                                                    </span>
                                                                )}
                                                                {record.status === 'L' && (
                                                                    <span className="inline-flex items-center gap-1.5 text-yellow-700 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400 px-3 py-1 rounded-full font-bold text-xs">
                                                                        <AlertCircle size={14} /> Leave
                                                                    </span>
                                                                )}
                                                            </td>
                                                            <td className="p-4 text-gray-500 italic text-sm">
                                                                {record.remarks || "-"}
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            )}
            <ToastContainer />
        </div>
    );
}