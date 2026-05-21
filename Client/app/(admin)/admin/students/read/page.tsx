"use client"
import React, { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query'; // NEW IMPORT
import {
    useGetStudentById,
    useGetClasses,
    useGetStudentsByClass,
    deleteStudentAPI // IMPORT YOUR DELETE API
} from '@/lib/Admin/AdminStudentApi';
import { toast, ToastContainer } from 'react-toastify';

const AdminStudentSearch = () => {
    // UI Input States
    const [studentIdInput, setStudentIdInput] = useState('');
    const [selectedClassId, setSelectedClassId] = useState('');

    // Active Search Queries
    const [searchId, setSearchId] = useState('');
    const [searchClassQuery, setSearchClassQuery] = useState('');

    const queryClient = useQueryClient(); // For updating table after delete

    const { data: classesResponse, isLoading: isClassesLoading } = useGetClasses();

    const { data: studentData, isFetching: isFetchingId, isError: isErrorId } = useGetStudentById(searchId);
    const { data: classStudentsData, isFetching: isFetchingClass, isError: isErrorClass } = useGetStudentsByClass(searchClassQuery);

    const handleSearchById = (e: React.FormEvent) => {
        e.preventDefault();
        if (!studentIdInput.trim()) return;
        setSearchId(studentIdInput.trim());
        setSearchClassQuery('');
        setSelectedClassId('');
    };

    const handleSearchByClass = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedClassId) return;
        setSearchClassQuery(selectedClassId);
        setSearchId('');
        setStudentIdInput('');
    };

    // --- NEW: Handle Delete Function ---
    const handleDelete = async (id: string) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this student? This action cannot be undone.");
        if (!confirmDelete) return;

        try {
            await deleteStudentAPI(id);
            toast.success("Student deleted successfully!");

            // Ye line bina page refresh kiye aapke table ka data update kar degi
            if (searchId) queryClient.invalidateQueries({ queryKey: ['student', searchId] });
            if (searchClassQuery) queryClient.invalidateQueries({ queryKey: ['studentsByClass', searchClassQuery] });

        } catch (error) {
            toast.error("Failed to delete student. Please try again.");
        }
    };

    // Dynamically set table data based on active search type
    let displayData: any[] = [];
    if (searchId && studentData) {
        displayData = [studentData];
    } else if (searchClassQuery && classStudentsData) {
        displayData = Array.isArray(classStudentsData) ? classStudentsData : [];
    }

    const isFetching = isFetchingId || isFetchingClass;
    const isError = isErrorId || isErrorClass;

    return (
        <div className="p-6 max-w-6xl mx-auto bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold mb-8 text-gray-800">Student Administration</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* ID Search Box */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h2 className="text-lg font-semibold mb-4 text-gray-700">Find Student by ID</h2>
                    <form onSubmit={handleSearchById} className="flex gap-2">
                        <input
                            type="text"
                            placeholder="e.g. STU101"
                            value={studentIdInput}
                            onChange={(e) => setStudentIdInput(e.target.value)}
                            className="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                        <button
                            type="submit"
                            disabled={isFetching}
                            className="px-6 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
                        >
                            {isFetchingId ? 'Searching...' : 'Search'}
                        </button>
                    </form>
                </div>

                {/* Class Search Box */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h2 className="text-lg font-semibold mb-4 text-gray-700">Search by Class</h2>
                    <form onSubmit={handleSearchByClass} className="flex gap-2">
                        <select
                            value={selectedClassId}
                            onChange={(e) => setSelectedClassId(e.target.value)}
                            className="flex-1 p-2 border border-gray-300 rounded bg-white outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">{isClassesLoading ? 'Loading classes...' : 'Select a class to view'}</option>
                            {classesResponse?.data?.map((cls: any) => (
                                <option key={cls._id} value={cls._id}>
                                    {cls.name} - {cls.section}
                                </option>
                            ))}
                        </select>
                        <button
                            type="submit"
                            disabled={isClassesLoading || !selectedClassId || isFetchingClass}
                            className="px-6 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
                        >
                            {isFetchingClass ? 'Searching...' : 'Search'}
                        </button>
                    </form>
                </div>
            </div>

            {/* Results Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Full Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Class/Section</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Teacher</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {displayData.length > 0 ? (
                            displayData.map((item) => (
                                <tr key={item._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-600">
                                        {item.studentId}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                                        {item.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {item.classId?.name} {item.classId?.section ? `- ${item.classId.section}` : ''}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {item.teacherId?.name.toUpperCase()}
                                    </td>

                                    {/* UPDATED ACTIONS COLUMN */}
                                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                        <div className="flex justify-center items-center space-x-4">
                                            {/* View Button */}
                                            <button
                                                onClick={() => window.location.href = `/admin/student/profile/${item._id}`}
                                                className="text-gray-500 hover:text-gray-800 transition-colors"
                                            >
                                                View
                                            </button>

                                            {/* Edit Button */}
                                            <button
                                                onClick={() => window.location.href = `/admin/students/edit/${item._id}`}
                                                className="text-blue-600 hover:text-blue-900 transition-colors"
                                            >
                                                Edit
                                            </button>

                                            {/* Delete Button */}
                                            <button
                                                onClick={() => handleDelete(item._id)}
                                                className="text-red-600 hover:text-red-900 transition-colors"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                                    {isFetching ? (
                                        <span className="animate-pulse">Loading student data...</span>
                                    ) : isError ? (
                                        <span className="text-red-500">No students found or an error occurred.</span>
                                    ) : (
                                        "No student selected. Please enter an ID or select a class above."
                                    )}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <ToastContainer />
        </div>

    );
};

export default AdminStudentSearch;