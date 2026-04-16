'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCreateExam } from '@/hooks/useExam';
import { toast, ToastContainer } from 'react-toastify';

export default function AddExamPage() {
    const router = useRouter();
    const createMutation = useCreateExam();

    // Initialized state with examType as an empty string
    const [formData, setFormData] = useState({
        name: '',
        examType: '',
        academicYear: '',
        startDate: '',
        endDate: '',
        status: 'Upcoming',
        description: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        createMutation.mutate(formData, {
            onSuccess: () => {
                toast.success("Exam Added Successfully");
                router.push('/admin/exam/read');
            },
            onError: () => {
                toast.error("Failed to add exam. Please try again.");
            }
        });
    };

    return (
        <div className="p-8 max-w-2xl mx-auto bg-white rounded shadow-md mt-6">
            <h1 className="text-2xl font-bold mb-6">Add New Exam</h1>

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
                        placeholder="e.g., Class 10 Board Prelims"
                        required
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Exam Type - Now a Text Input */}
                    <div>
                        <label className="block font-medium mb-1">Exam Type <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            name="examType"
                            className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.examType}
                            onChange={handleChange}
                            placeholder="e.g., Mid-Term, Unit Test"
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
                            placeholder="e.g., 2025-2026"
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
                        placeholder="Add any additional details or instructions..."
                    />
                </div>

                <button
                    type="submit"
                    disabled={createMutation.isPending}
                    className="w-full bg-blue-600 text-white font-semibold px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
                >
                    {createMutation.isPending ? 'Saving Exam...' : 'Save Exam'}
                </button>
            </form>

            <ToastContainer position="bottom-right" />
        </div>
    );
}