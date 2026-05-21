"use client"
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query'; // IMPORT ADD KIYA HAI
import { fetchTeachers } from "@/lib/Admin/TeacherApi";
import { useGetStudentById, useUpdateStudent, useGetClasses } from '@/lib/Admin/AdminStudentApi';
import { toast, ToastContainer } from 'react-toastify';

const EditStudentPage = () => {
    const params = useParams();
    const router = useRouter();
    const studentId = params.id as string;

    // Fetch existing student & classes data
    const { data: studentData, isFetching: isFetchingStudent, isError } = useGetStudentById(studentId);
    const { data: classesResponse } = useGetClasses();

    // Fetch Teachers data
    const { data: teachersData, isLoading: isLoadingTeachers } = useQuery({
        queryKey: ["teachers"],
        queryFn: fetchTeachers,
    });

    // Update Mutation Hook
    const updateStudentMutation = useUpdateStudent();

    // Form State (Teacher ID add kiya)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        classId: '',
        teacherId: '', // NAYA FIELD
    });

    // Jab student data API se aa jaye, toh form ko auto-fill kar do
    useEffect(() => {
        if (studentData) {
            setFormData({
                name: studentData.name || '',
                email: studentData.email || '',
                classId: studentData.classId?._id || studentData.classId || '',
                teacherId: studentData.teacherId?._id || studentData.teacherId || '', // TEACHER ID BHI SET KIYA
            });
        }
    }, [studentData]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Basic Validation (Teacher ID bhi check kiya)
        if (!formData.name.trim() || !formData.email.trim() || !formData.classId || !formData.teacherId) {
            toast.warn("Please fill all required fields!");
            return;
        }

        try {
            // Mutation call for update
            await updateStudentMutation.mutateAsync({
                id: studentId,
                payload: formData,
            });

            toast.success("Student updated successfully! 🎉");

            // Thoda ruk kar wapas search page par bhej do
            setTimeout(() => {
                router.push('/admin/students/read'); // Apna actual list/search route yahan daalein
            }, 1500);

        } catch (error: any) {
            console.error("Update failed", error);
            toast.error(error?.response?.data?.message || "Failed to update student. Try again.");
        }
    };

    // Loading State UI
    if (isFetchingStudent) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-lg text-gray-600 font-medium">Loading student data...</span>
            </div>
        );
    }

    // Error State UI
    if (isError || !studentData) {
        return (
            <div className="p-8 text-center bg-gray-50 min-h-screen">
                <h2 className="text-2xl text-red-600 font-bold mb-4">Student Not Found</h2>
                <button onClick={() => router.back()} className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-3xl mx-auto bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Edit Student</h1>
                <button
                    onClick={() => router.back()}
                    className="text-gray-600 hover:text-gray-900 border border-gray-300 px-4 py-2 rounded shadow-sm bg-white"
                >
                    Cancel / Back
                </button>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
                <div className="mb-6 pb-4 border-b border-gray-100">
                    <p className="text-sm text-gray-500 uppercase tracking-wide">Student ID (Non-editable)</p>
                    <p className="text-xl font-bold text-blue-700">{studentData.studentId}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name Input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
                        />
                    </div>

                    {/* Email Input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
                        />
                    </div>

                    {/* Class Dropdown */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Class & Section</label>
                        <select
                            name="classId"
                            value={formData.classId}
                            onChange={handleInputChange}
                            required
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none bg-white transition-shadow"
                        >
                            <option value="" disabled>Select a class...</option>
                            {classesResponse?.data?.map((cls: any) => (
                                <option key={cls._id} value={cls._id}>
                                    {cls.name} - {cls.section}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Teacher Dropdown */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Assigned Teacher</label>
                        <select
                            name="teacherId"
                            value={formData.teacherId}
                            onChange={handleInputChange}
                            required
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none bg-white transition-shadow"
                        >
                            <option value="" disabled>
                                {isLoadingTeachers ? "Loading teachers..." : "Select a teacher..."}
                            </option>
                            {teachersData?.teachers?.map((teacher: any) => (
                                <option key={teacher._id} value={teacher._id}>
                                    {teacher.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={updateStudentMutation.isPending}
                            className={`w-full py-3 px-4 font-bold text-white rounded-md shadow-sm transition-all
                                ${updateStudentMutation.isPending
                                    ? 'bg-blue-400 cursor-not-allowed'
                                    : 'bg-blue-600 hover:bg-blue-700 hover:shadow-md'
                                }`}
                        >
                            {updateStudentMutation.isPending ? 'Saving Changes...' : 'Update Student Details'}
                        </button>
                    </div>
                </form>
            </div>
            <ToastContainer />
        </div>

    );
};

export default EditStudentPage;