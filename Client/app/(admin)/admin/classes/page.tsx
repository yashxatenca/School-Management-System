"use client";

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { classService } from '@/lib/Admin/AdminClassService';
import { useGetTeachers } from "@/hooks/Admin/useTeacher"

export default function ClassPage() {
    const queryClient = useQueryClient();
    const [editingId, setEditingId] = useState<string | null>(null);

    // 1. Fetch Data
    const { data: classes, isLoading } = useQuery({
        queryKey: ['classes'],
        queryFn: classService.getAll
    });

    const { data: teachers } = useGetTeachers();

    // 2. Form Handling
    // Set default values for optional fields so they reset properly
    const { register, handleSubmit, reset, setValue } = useForm({
        defaultValues: {
            name: '',
            section: '',
            academicYear: '',
            strength: 0,
            teacherId: '',
            isActive: true
        }
    });

    // 3. Mutations
    const createMutation = useMutation({
        mutationFn: classService.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['classes'] });
            reset();
        }
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: any) => classService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['classes'] });
            setEditingId(null);
            reset();
        }
    });

    const deleteMutation = useMutation({
        mutationFn: classService.delete,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['classes'] })
    });

    const onSubmit = (data: any) => {
        // Clean up empty optional fields before sending to API
        const payload = { ...data };
        if (!payload.teacherId) delete payload.teacherId;

        if (editingId) {
            updateMutation.mutate({ id: editingId, data: payload });
        } else {
            createMutation.mutate(payload);
        }
    };

    const handleEdit = (cls: any) => {
        setEditingId(cls._id);
        setValue('name', cls.name);
        setValue('section', cls.section);
        setValue('academicYear', cls.academicYear);

        // Optional fields
        setValue('strength', cls.strength || 0);
        setValue('teacherId', cls.teacherId || '');
        setValue('isActive', cls.isActive !== false); // Defaults to true if undefined
    };

    const inputClasses = "p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none w-full";

    if (isLoading) return <div className="p-10 text-center">Loading...</div>;

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8">
            {/* ADD/EDIT FORM */}
            <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h2 className="text-xl font-bold mb-4">{editingId ? 'Edit Class' : 'Add New Class'}</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                    {/* Row 1: Required Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-xs text-gray-500 mb-1">Class Name *</label>
                            <input {...register('name')} placeholder="e.g. Grade 10" className={inputClasses} required />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-500 mb-1">Section *</label>
                            <input {...register('section')} placeholder="e.g. A" className={`${inputClasses} uppercase`} required />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-500 mb-1">Academic Year *</label>
                            <input {...register('academicYear')} placeholder="e.g. 2025-26" className={inputClasses} required />
                        </div>
                    </div>

                    {/* Row 2: Optional Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                        <div>
                            <label className="block text-xs text-gray-500 mb-1">Class Strength (Optional)</label>
                            <input type="number" min="0" {...register('strength', { valueAsNumber: true })} placeholder="Total Students" className={inputClasses} />
                        </div>

                        <div>
                            <label className="block text-xs text-gray-500 mb-1">Class Teacher (Optional)</label>
                            <select {...register('teacherId')} className={`${inputClasses} bg-white`}>
                                <option value="">No Teacher Assigned</option>
                                {teachers?.teachers?.map((t: any) => (
                                    <option key={t._id} value={t._id}>{t.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex items-center h-10 px-2">
                            <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-700">
                                <input type="checkbox" {...register('isActive')} className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500" />
                                Class is Active
                            </label>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-2">
                        <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition">
                            {editingId ? 'Update Class' : 'Save Class'}
                        </button>
                        {editingId && (
                            <button type="button" onClick={() => { setEditingId(null); reset(); }} className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 transition">
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </section>

            {/* CLASS LIST */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {(Array.isArray(classes) ? classes : classes?.data)?.map((cls: any) => (
                    <div key={cls._id} className={`bg-white p-5 rounded-xl border shadow-sm hover:shadow-md transition ${!cls.isActive ? 'border-red-200 bg-red-50/30' : 'border-gray-100'}`}>
                        <div className="flex justify-between items-start">
                            <div>
                                <div className="flex items-center gap-2">
                                    <h3 className="text-lg font-bold text-gray-900">{cls.name}</h3>
                                    {!cls.isActive && <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold">INACTIVE</span>}
                                </div>
                                <p className="text-sm text-indigo-600 font-medium">Section: {cls.section}</p>
                                <p className="text-xs text-gray-500 mt-1">Year: {cls.academicYear}</p>

                                {/* Show optional data if it exists */}
                                {(cls.strength > 0 || cls.teacherId) && (
                                    <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500 space-y-1">
                                        {cls.strength > 0 && <p>Strength: <b>{cls.strength}</b> students</p>}
                                        {cls.teacherId && <p>Teacher ID: {cls.teacherId.name}</p>}
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col gap-2">
                                <button
                                    onClick={() => handleEdit(cls)}
                                    className="text-xs bg-amber-50 text-amber-600 px-3 py-1 rounded border border-amber-100 hover:bg-amber-100 transition"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => { if (confirm('Are you sure you want to delete this class?')) deleteMutation.mutate(cls._id) }}
                                    className="text-xs bg-red-50 text-red-600 px-3 py-1 rounded border border-red-100 hover:bg-red-100 transition"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </section>
        </div>
    );
}