"use client";

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast, ToastContainer } from 'react-toastify'; // Import toast
import { subjectService } from '@/lib/admin_api/AdminSubjectService';

export default function SubjectPage() {
    const queryClient = useQueryClient();
    const [editingId, setEditingId] = useState<string | null>(null);

    const { data: response, isLoading } = useQuery({
        queryKey: ['subjects'],
        queryFn: subjectService.getAll,
    });

    const subjects = Array.isArray(response) ? response : response?.data || [];
    const { register, handleSubmit, reset, setValue } = useForm();

    // --- MUTATIONS WITH TOASTS ---

    const createMutation = useMutation({
        mutationFn: subjectService.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['subjects'] });
            toast.success("Subject created successfully! 📚");
            reset();
        },
        onError: (err: any) => {
            toast.error(err?.response?.data?.message || "Failed to create subject");
        }
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: any) => subjectService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['subjects'] });
            toast.info("Subject updated! 📝");
            setEditingId(null);
            reset();
        },
        onError: () => toast.error("Update failed")
    });

    const deleteMutation = useMutation({
        mutationFn: subjectService.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['subjects'] });
            toast.warn("Subject deleted");
        },
        onError: () => toast.error("Could not delete subject")
    });

    const onSubmit = (data: any) => {
        if (editingId) {
            updateMutation.mutate({ id: editingId, data });
        } else {
            createMutation.mutate(data);
        }
    };

    const handleEdit = (sub: any) => {
        setEditingId(sub._id);
        setValue('name', sub.name);
        setValue('code', sub.code);
        setValue('description', sub.description);
        toast.dark("Editing mode enabled");
    };

    if (isLoading) return <div className="p-10 text-center animate-pulse text-gray-400">Loading...</div>;

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8">
            {/* FORM SECTION */}
            <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <h2 className="text-xl font-bold mb-4 text-gray-800">
                    {editingId ? 'Edit Subject' : 'Add New Subject'}
                </h2>
                <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <input
                        {...register('name')}
                        placeholder="Name"
                        className="p-2.5 border rounded-xl outline-none focus:border-indigo-500"
                        required
                    />
                    <input
                        {...register('code')}
                        placeholder="Code"
                        className="p-2.5 border rounded-xl uppercase outline-none focus:border-indigo-500"
                        required
                    />
                    <input
                        {...register('description')}
                        placeholder="Description"
                        className="p-2.5 border rounded-xl outline-none focus:border-indigo-500"
                    />
                    <div className="flex gap-2">
                        <button
                            type="submit"
                            className="flex-1 bg-indigo-600 text-white py-2.5 rounded-xl font-semibold hover:bg-indigo-700 transition"
                        >
                            {editingId ? 'Update' : 'Save'}
                        </button>
                        {editingId && (
                            <button
                                type="button"
                                onClick={() => { setEditingId(null); reset(); }}
                                className="bg-gray-100 px-4 rounded-xl"
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </section>

            {/* GRID LIST */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {subjects.map((sub: any) => (
                    <div key={sub._id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition">
                        <div className="flex justify-between items-start">
                            <div>
                                <span className="text-[10px] font-bold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded uppercase">
                                    {sub.code}
                                </span>
                                <h3 className="text-xl font-bold text-gray-900 mt-2">{sub.name}</h3>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => handleEdit(sub)} className="text-amber-500 p-1 hover:bg-amber-50 rounded">Edit</button>
                                <button
                                    onClick={() => { if (confirm('Delete?')) deleteMutation.mutate(sub._id) }}
                                    className="text-red-500 p-1 hover:bg-red-50 rounded"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </section>
            <ToastContainer />
        </div>
    );
}