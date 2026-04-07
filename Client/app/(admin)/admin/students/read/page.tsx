"use client"
import React, { useState } from 'react';
import { useGetStudentById, useGetClasses } from '@/lib/admin_api/AdminStudentApi';

const AdminStudentSearch = () => {
    // 1. UI Input States
    const [studentIdInput, setStudentIdInput] = useState('');
    const [selectedClassId, setSelectedClassId] = useState('');

    // 2. Query Trigger State
    const [searchId, setSearchId] = useState('');

    // 3. TanStack Hooks
    // useGetClasses uses your classService.getAll internally
    const { data: classesResponse, isLoading: isClassesLoading } = useGetClasses();

    // useGetStudentById hits /api/v1/admin/student/:id
    const { data: student, isFetching, isError } = useGetStudentById(searchId);

    // 4. Handlers
    const handleSearchById = (e: React.FormEvent) => {
        e.preventDefault();
        if (!studentIdInput.trim()) return;

        setSearchId(studentIdInput.trim());
        setSelectedClassId(''); // Reset class dropdown when searching specific ID
    };

    // Logic to prepare table data
    // Since GetByStudentId returns a single object, we wrap it in an array for the .map()
    const displayData = student ? [student] : [];

    return (
        <div className="p-6 max-w-6xl mx-auto bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold mb-8 text-gray-800">Student Administration</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Search by Student ID */}
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
                            {isFetching ? 'Searching...' : 'Search'}
                        </button>
                    </form>
                </div>

                {/* View Available Classes (Fetched via classService) */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h2 className="text-lg font-semibold mb-4 text-gray-700">Quick Class Reference</h2>
                    <select
                        value={selectedClassId}
                        onChange={(e) => setSelectedClassId(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded bg-white"
                    >
                        <option value="">{isClassesLoading ? 'Loading classes...' : 'Select a class to view'}</option>
                        {classesResponse?.data?.map((cls: any) => (
                            <option key={cls._id} value={cls._id}>
                                {cls.name} - {cls.section}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Results Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Full Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Class/Section</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Action</th>
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
                                        {item.section || 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => window.location.href = `/admin/student/profile/${item._id}`}
                                            className="text-indigo-600 hover:text-indigo-900"
                                        >
                                            View Profile
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                                    {isFetching ? (
                                        <span className="animate-pulse">Loading student data...</span>
                                    ) : isError ? (
                                        <span className="text-red-500">Student not found. Check the ID and try again.</span>
                                    ) : (
                                        "No student selected. Please enter an ID above."
                                    )}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminStudentSearch;