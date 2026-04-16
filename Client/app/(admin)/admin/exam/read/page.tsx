'use client'
import React from 'react';
import Link from 'next/link';
import { useExams, useDeleteExam } from '@/hooks/useExam';
// import { useGetClasses } from '@/hooks/useClass'; // Ye use nahi ho raha toh hata sakte hain

export default function ExamListPage() {
    const { data: exams, isLoading, isError } = useExams();
    const deleteMutation = useDeleteExam();

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this exam?')) {
            deleteMutation.mutate(id);
        }
    };

    if (isLoading) return <div>Loading exams...</div>;
    if (isError) return <div>Error fetching exams!</div>;

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Exams List</h1>
                <Link href="/admin/exam/add" className="bg-blue-600 text-white px-4 py-2 rounded">
                    + Add Exam
                </Link>
            </div>

            <table className="min-w-full bg-white shadow-md rounded">
                <thead>
                    <tr>
                        <th className="p-4 border-b">Name</th>
                        <th className="p-4 border-b">Type</th>
                        <th className="p-4 border-b">Academic Year</th>
                        <th className="p-4 border-b">Start Date</th>
                        <th className="p-4 border-b">End Date</th>
                        <th className="p-4 border-b">Status</th>
                        <th className="p-4 border-b">Description</th>
                        <th className="p-4 border-b">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {exams?.map((exam: any) => (
                        <tr key={exam._id}>
                            <td className="p-4 border-b text-center">{exam.name}</td>
                            <td className="p-4 border-b text-center">{exam.examType}</td>
                            <td className="p-4 border-b text-center">{exam.academicYear}</td>

                            {/* FIX: Removed extra .startDate and added optional chaining (?.) */}
                            <td className="p-4 border-b text-center">
                                {exam.startDate?.split('T')[0]}
                            </td>

                            {/* FIX: Removed () from the end and added optional chaining (?.) */}
                            <td className="p-4 border-b text-center">
                                {exam.endDate?.split('T')[0]}
                            </td>

                            <td className="p-4 border-b text-center">{exam.status}</td>
                            <td className="p-4 border-b text-center">{exam.description}</td>

                            <td className="p-4 border-b text-center space-x-4">
                                <Link href={`/admin/exam/edit/${exam._id}`} className="text-blue-500 hover:underline">
                                    Edit
                                </Link>
                                <button
                                    onClick={() => handleDelete(exam._id)}
                                    disabled={deleteMutation.isPending}
                                    className="text-red-500 hover:underline disabled:opacity-50"
                                >
                                    {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}