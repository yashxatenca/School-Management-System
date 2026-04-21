"use client";

import React from 'react';
import Link from 'next/link';
import { useMarks } from '@/hooks/Admin/useMarks';
import { Edit, Trash2, Plus, FileText } from 'lucide-react';

export default function MarksListPage() {
    const { marksQuery, deleteMutation } = useMarks();

    if (marksQuery.isLoading) return <div className="p-8 text-center">Loading marks...</div>;
    if (marksQuery.isError) return <div className="p-8 text-center text-red-500">Error loading marks.</div>;

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <FileText className="w-6 h-6" /> Student Marks
                </h1>
                <Link
                    href="/admin/marks/add"
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                >
                    <Plus className="w-4 h-4" /> Add Marks
                </Link>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="p-4 font-medium text-gray-600">Student ID</th>
                            <th className="p-4 font-medium text-gray-600">Exam ID</th>
                            <th className="p-4 font-medium text-gray-600">Total Marks</th>
                            <th className="p-4 font-medium text-gray-600">Status</th>
                            <th className="p-4 font-medium text-gray-600 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {marksQuery.data?.map((mark) => (
                            <tr key={mark._id} className="border-b hover:bg-gray-50">
                                {/* Note: In a real app, populate studentId to show name */}
                                <td className="p-4">{typeof mark.studentId === 'string' ? mark.studentId : (mark.studentId as any)._id}</td>
                                <td className="p-4">{typeof mark.examId === 'string' ? mark.examId : (mark.examId as any)._id}</td>
                                <td className="p-4 font-semibold">{mark.totalObtainedMarks} / {mark.totalMaxMarks} ({mark.percentage}%)</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${mark.resultStatus === 'Pass' ? 'bg-green-100 text-green-700' :
                                        mark.resultStatus === 'Fail' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                                        }`}>
                                        {mark.resultStatus}
                                    </span>
                                </td>
                                <td className="p-4 flex justify-end gap-3">
                                    <Link href={`/admin/marks/edit/${mark._id}`} className="text-blue-500 hover:text-blue-700">
                                        <Edit className="w-5 h-5" />
                                    </Link>
                                    <button
                                        onClick={() => {
                                            if (confirm('Are you sure you want to delete this record?')) {
                                                deleteMutation.mutate(mark._id!);
                                            }
                                        }}
                                        className="text-red-500 hover:text-red-700"
                                        disabled={deleteMutation.isPending}
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {marksQuery.data?.length === 0 && (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-gray-500">No marks records found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}