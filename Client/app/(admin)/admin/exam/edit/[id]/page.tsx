'use client'
import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useGetExam, useUpdateExam } from '@/hooks/Admin/useExam';
import { toast, ToastContainer } from 'react-toastify';

export default function EditExamPage() {
    const router = useRouter();
    const params = useParams();
    const examId = params.id as string;

    // Fetch existing data & Setup mutation
    const { data: examData, isLoading, isError } = useGetExam(examId);
    const updateMutation = useUpdateExam();

    const [formData, setFormData] = useState({
        name: '',
        examType: '',
        academicYear: '',
        startDate: '',
        endDate: '',
        status: 'Upcoming',
        description: ''
    });

    // Populate form when data is loaded
    useEffect(() => {
        if (examData) {
            // Helper to format ISO dates to YYYY-MM-DD for the HTML date input
            const formatDate = (dateString: string) => {
                if (!dateString) return '';
                return new Date(dateString).toISOString().split('T')[0];
            };

            setFormData({
                name: examData.name || '',
                examType: examData.examType || '',
                academicYear: examData.academicYear || '',
                startDate: formatDate(examData.startDate),
                endDate: formatDate(examData.endDate),
                status: examData.status || 'Upcoming',
                description: examData.description || ''
            });
        }
    }, [examData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Pass both the ID and the updated data to your mutation
        updateMutation.mutate({ id: examId, data: formData }, {
            onSuccess: () => {
                toast.success("Exam Updated Successfully");
                router.push('/admin/exam/read'); // Redirects to your separate manage/show page
            },
            onError: () => {
                toast.error("Failed to update exam. Please try again.");
            }
        });
    };

    if (isLoading) return <div className="p-8 text-center">Loading exam details...</div>;
    if (isError) return <div className="p-8 text-center text-red-500">Error loading exam. It may have been deleted.</div>;

    return (
        <div className="p-8 max-w-2xl mx-auto bg-white rounded shadow-md mt-6">
            <h1 className="text-2xl font-bold mb-6">Edit Exam</h1>

            <form onSubmit={handleSubmit} className="space-y-5">

                {/* Exam Name */}
                <div>
                    <label className="block font-medium mb-1">Exam Name <span className="text-red-500">*</span></label>
                    <input
                        type="text"
                        name="name"
                        className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Exam Type */}
                    <div>
                        <label className="block font-medium mb-1">Exam Type <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            name="examType"
                            className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.examType}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Academic Year */}
                    <div>
                        <label className="block font-medium mb-1">Academic Year <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            name="academicYear"
                            className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.academicYear}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Start Date */}
                    <div>
                        <label className="block font-medium mb-1">Start Date <span className="text-red-500">*</span></label>
                        <input
                            type="date"
                            name="startDate"
                            className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.startDate}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* End Date */}
                    <div>
                        <label className="block font-medium mb-1">End Date <span className="text-red-500">*</span></label>
                        <input
                            type="date"
                            name="endDate"
                            className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.endDate}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                {/* Status */}
                <div>
                    <label className="block font-medium mb-1">Status</label>
                    <select
                        name="status"
                        className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                        value={formData.status}
                        onChange={handleChange}
                    >
                        <option value="Upcoming">Upcoming</option>
                        <option value="Ongoing">Ongoing</option>
                        <option value="Completed">Completed</option>
                        <option value="Results_Declared">Results Declared</option>
                    </select>
                </div>

                {/* Description */}
                <div>
                    <label className="block font-medium mb-1">Description</label>
                    <textarea
                        name="description"
                        rows={3}
                        className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                        value={formData.description}
                        onChange={handleChange}
                    />
                </div>

                <div className="flex gap-4">
                    <button
                        type="button"
                        onClick={() => router.push('/admin/exam/read')}
                        className="w-full bg-gray-200 text-gray-800 font-semibold px-4 py-2 rounded hover:bg-gray-300 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={updateMutation.isPending}
                        className="w-full bg-blue-600 text-white font-semibold px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
                    >
                        {updateMutation.isPending ? 'Updating...' : 'Update Exam'}
                    </button>
                </div>
            </form>

            <ToastContainer position="bottom-right" />
        </div>
    );
}