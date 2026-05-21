"use client";

import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify"; // <-- Added Toastify
import { fetchTeachers } from "@/lib/Admin/TeacherApi";
import { classService } from "@/lib/Admin/AdminClassService";
import { getschoolbyauthid } from "@/lib/Admin/AdminProfile.api";
import { studentService, CreateStudentPayload } from "@/lib/Admin/AdminStudentApi";

export default function AddStudentPage() {
    const queryClient = useQueryClient();

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        teacherId: "",
        classId: "",
    });

    // --- TANSTACK QUERIES ---
    const { data: teachersData, isLoading: isLoadingTeachers } = useQuery({
        queryKey: ["teachers"],
        queryFn: fetchTeachers,
    });

    const { data: classesData, isLoading: isLoadingClasses } = useQuery({
        queryKey: ["classes"],
        queryFn: classService.getAll,
    });

    const { data: schoolData, isLoading: isLoadingSchool } = useQuery({
        queryKey: ["schoolInfo"],
        queryFn: getschoolbyauthid,
    });

    // Extract arrays from your specific API response structures
    const teachers = teachersData?.teachers || teachersData || [];
    const classes = classesData?.data || classesData || [];
    const schoolId = schoolData || "";

    // --- TANSTACK MUTATION ---
    const createMutation = useMutation({
        mutationFn: studentService.create,
        onSuccess: () => {
            setFormData({ name: "", email: "", password: "", teacherId: "", classId: "" });
            toast.success("Student added successfully!");

            queryClient.invalidateQueries({ queryKey: ["students"] });
        },
        onError: (error: any) => {
            console.error("Error creating student:", error);
            toast.error(error?.response?.data?.message || "Failed to create student."); // <-- Updated to Toast
        },
    });

    // --- HANDLERS ---
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!schoolId) {
            toast.warning("School information is missing. Cannot add student."); // <-- Updated to Toast
            return;
        }

        const payload: CreateStudentPayload = {
            ...formData,
            schoolId: schoolId,
        };

        createMutation.mutate(payload);
    };

    const isPageLoading = isLoadingTeachers || isLoadingClasses || isLoadingSchool;

    if (isPageLoading) {
        return <div className="p-6 text-gray-500">Loading form data...</div>;
    }

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Student</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                    <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Jack"
                    />
                </div>

                {/* Email */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Email Address</label>
                    <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="student@example.com"
                    />
                </div>

                {/* Password */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Temporary Password</label>
                    <input
                        type="password"
                        name="password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="••••••••"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Class Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Assign Class</label>
                        <select
                            name="classId"
                            required
                            value={formData.classId}
                            onChange={handleChange}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-white focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="" disabled>Select a Class</option>
                            {/* OPTIMIZATION: Added Array.isArray check to prevent map errors just in case */}
                            {Array.isArray(classes) && classes.map((c: any) => (
                                <option key={c._id} value={c._id}>
                                    {c.name} {c.section}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Teacher Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Assign Teacher</label>
                        <select
                            name="teacherId"
                            required
                            value={formData.teacherId}
                            onChange={handleChange}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-white focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="" disabled>Select a Teacher</option>
                            {/* OPTIMIZATION: Added Array.isArray check to prevent map errors */}
                            {Array.isArray(teachers) && teachers.map((t: any) => (
                                <option key={t._id} value={t._id}>
                                    {t.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={createMutation.isPending}
                        className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
                    >
                        {createMutation.isPending ? "Creating Student..." : "Add Student"}
                    </button>
                </div>
            </form>
        </div>
    );
}