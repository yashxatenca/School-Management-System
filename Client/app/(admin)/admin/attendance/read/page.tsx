'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/axios'; // Aapka axios instance path
import { Calendar, Users, Loader2, CheckCircle, XCircle, AlertCircle, Search } from 'lucide-react';

// API Fetcher Function
const fetchAttendanceView = async (classId: string, date: string) => {
    if (!classId || !date) return null;
    // Aapke backend route ke hisaab se API call
    const res = await api.get(`/api/v1/admin/attendance/class/${classId}?date=${date}`);
    // Kyunki backend array return karta hai, hum pehla record lenge
    return res.data.data && res.data.data.length > 0 ? res.data.data[0] : null;
};

export default function ViewClassAttendancePage() {
    // Local States for Filters
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [classId, setClassId] = useState('60d5ec49f1b2c4001f8e4e1a'); // Apna default class _id daalein

    // Fetch Data using TanStack Query
    const { data: attendanceRecord, isLoading, isError } = useQuery({
        queryKey: ['viewAttendance', classId, date],
        queryFn: () => fetchAttendanceView(classId, date),
        enabled: !!classId && !!date,
    });

    // Calculate Stats
    const studentsList = attendanceRecord?.attendance || [];
    const totalStudents = studentsList.length;
    const presentCount = studentsList.filter((s: any) => s.status === 'P').length;
    const absentCount = studentsList.filter((s: any) => s.status === 'A').length;
    const leaveCount = studentsList.filter((s: any) => s.status === 'L').length;

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-6">

            {/* Page Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold flex items-center gap-2 text-gray-800 dark:text-white">
                    <Search className="text-indigo-600" /> View Class Attendance
                </h1>
            </div>

            {/* Filters (Date & Class) */}
            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border flex gap-4 items-end">
                <div className="flex-1">
                    <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-300">Select Date</label>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-3.5 text-gray-400" size={18} />
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="pl-10 w-full p-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 dark:bg-gray-800"
                        />
                    </div>
                </div>
                <div className="flex-1">
                    <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-300">Select Class</label>
                    <select
                        value={classId}
                        onChange={(e) => setClassId(e.target.value)}
                        className="w-full p-2.5 border rounded-xl bg-gray-50 dark:bg-gray-800 outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        {/* Yahan apni classes map karein */}
                        <option value="60d5ec49f1b2c4001f8e4e1a">Class 10 - Section A</option>
                        <option value="60d5ec49f1b2c4001f8e4e1b">Class 10 - Section B</option>
                    </select>
                </div>
            </div>

            {/* Loading State */}
            {isLoading && (
                <div className="flex justify-center py-20 bg-white rounded-2xl border">
                    <Loader2 className="animate-spin text-indigo-600 h-10 w-10" />
                </div>
            )}

            {/* Error State */}
            {isError && (
                <div className="text-center py-10 text-red-500 bg-white rounded-2xl border">
                    Failed to load attendance data.
                </div>
            )}

            {/* Empty State (No attendance marked yet) */}
            {!isLoading && !isError && (!attendanceRecord || studentsList.length === 0) && (
                <div className="text-center py-20 text-gray-500 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border">
                    <Users size={48} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-lg font-medium">No attendance record found.</p>
                    <p className="text-sm">Attendance hasn't been marked for this date yet.</p>
                </div>
            )}

            {/* Main Data View */}
            {!isLoading && !isError && attendanceRecord && studentsList.length > 0 && (
                <div className="space-y-6">

                    {/* Quick Stats Cards */}
                    <div className="grid grid-cols-4 gap-4">
                        <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl border shadow-sm text-center">
                            <p className="text-sm text-gray-500 font-semibold mb-1">Total Students</p>
                            <p className="text-3xl font-bold text-gray-800 dark:text-gray-100">{totalStudents}</p>
                        </div>
                        <div className="bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800/50 p-5 rounded-2xl shadow-sm text-center">
                            <p className="text-sm text-green-600 dark:text-green-400 font-semibold mb-1">Present</p>
                            <p className="text-3xl font-bold text-green-700 dark:text-green-500">{presentCount}</p>
                        </div>
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/50 p-5 rounded-2xl shadow-sm text-center">
                            <p className="text-sm text-red-600 dark:text-red-400 font-semibold mb-1">Absent</p>
                            <p className="text-3xl font-bold text-red-700 dark:text-red-500">{absentCount}</p>
                        </div>
                        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-100 dark:border-yellow-800/50 p-5 rounded-2xl shadow-sm text-center">
                            <p className="text-sm text-yellow-600 dark:text-yellow-400 font-semibold mb-1">Leave</p>
                            <p className="text-3xl font-bold text-yellow-700 dark:text-yellow-500">{leaveCount}</p>
                        </div>
                    </div>

                    {/* Attendance Table */}
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border overflow-hidden">
                        <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
                            <h3 className="font-bold text-gray-700 dark:text-gray-200">Student List</h3>
                            {attendanceRecord.isLocked && (
                                <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full border border-red-200">
                                    LOCKED
                                </span>
                            )}
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-300">
                                    <tr>
                                        <th className="p-4 border-b font-semibold">Roll No</th>
                                        <th className="p-4 border-b font-semibold">Student ID</th>
                                        <th className="p-4 border-b font-semibold">Name</th>
                                        <th className="p-4 border-b font-semibold">Status</th>
                                        <th className="p-4 border-b font-semibold">Remarks</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                    {studentsList.map((record: any) => {
                                        const student = record.studentId || {};
                                        return (
                                            <tr key={student._id || record._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                                                <td className="p-4 font-medium text-gray-600 dark:text-gray-400">{student.rollNumber || '-'}</td>
                                                <td className="p-4 text-gray-500">{student.studentId_custom || '-'}</td>
                                                <td className="p-4 font-semibold text-gray-800 dark:text-gray-200">{student.name || 'Unknown'}</td>
                                                <td className="p-4">
                                                    {record.status === 'P' && (
                                                        <span className="inline-flex items-center gap-1.5 text-green-700 bg-green-100 dark:bg-green-900/30 dark:text-green-400 px-3 py-1 rounded-full font-bold">
                                                            <CheckCircle size={14} /> Present
                                                        </span>
                                                    )}
                                                    {record.status === 'A' && (
                                                        <span className="inline-flex items-center gap-1.5 text-red-700 bg-red-100 dark:bg-red-900/30 dark:text-red-400 px-3 py-1 rounded-full font-bold">
                                                            <XCircle size={14} /> Absent
                                                        </span>
                                                    )}
                                                    {record.status === 'L' && (
                                                        <span className="inline-flex items-center gap-1.5 text-yellow-700 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400 px-3 py-1 rounded-full font-bold">
                                                            <AlertCircle size={14} /> Leave
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="p-4 text-gray-500 italic">{record.remarks || '-'}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}