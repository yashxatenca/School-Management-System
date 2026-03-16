"use client";

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { classService } from '@/lib/admin_api/AdminClassService';

export default function ClassPage() {
    const queryClient = useQueryClient();
    const [editingId, setEditingId] = useState<string | null>(null);

    // 1. Fetch Data
    const { data: classes, isLoading } = useQuery({
        queryKey: ['classes'],
        queryFn: classService.getAll
    });

    // 2. Form Handling
    const { register, handleSubmit, reset, setValue } = useForm();

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
        if (editingId) {
            updateMutation.mutate({ id: editingId, data });
        } else {
            createMutation.mutate(data);
        }
    };

    const handleEdit = (cls: any) => {
        setEditingId(cls._id);
        setValue('name', cls.name);
        setValue('section', cls.section);
        setValue('academicYear', cls.academicYear);
    };

    if (isLoading) return <div className="p-10 text-center">Loading...</div>;

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8">
            {/* ADD/EDIT FORM */}
            <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h2 className="text-xl font-bold mb-4">{editingId ? 'Edit Class' : 'Add New Class'}</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <input {...register('name')} placeholder="Class Name (e.g. Grade 10)" className="p-2 border rounded-lg" required />
                    <input {...register('section')} placeholder="Section (e.g. A)" className="p-2 border rounded-lg uppercase" required />
                    <input {...register('academicYear')} placeholder="Year (e.g. 2025-26)" className="p-2 border rounded-lg" required />
                    <div className="flex gap-2">
                        <button type="submit" className="flex-1 bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition">
                            {editingId ? 'Update' : 'Save'}
                        </button>
                        {editingId && (
                            <button type="button" onClick={() => { setEditingId(null); reset(); }} className="bg-gray-200 px-4 rounded-lg">Cancel</button>
                        )}
                    </div>
                </form>
            </section>

            {/* CLASS LIST */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {(Array.isArray(classes) ? classes : classes?.data)?.map((cls: any) => (
                    <div key={cls._id} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">{cls.name}</h3>
                                <p className="text-sm text-indigo-600 font-medium">Section: {cls.section}</p>
                                <p className="text-xs text-gray-400 mt-1">{cls.academicYear}</p>
                            </div>
                            <div className="flex flex-col gap-2">
                                <button
                                    onClick={() => handleEdit(cls)}
                                    className="text-xs bg-amber-50 text-amber-600 px-3 py-1 rounded border border-amber-100 hover:bg-amber-100 transition"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => { if (confirm('Are you sure?')) deleteMutation.mutate(cls._id) }}
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