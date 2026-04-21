"use client";

import React from 'react';
import { useParams } from 'next/navigation';
import { useMarks } from '@/hooks/Admin/useMarks';
import { MarkForm } from '@/app/(admin)/admin/marks/add/page';
import { Edit } from 'lucide-react';

export default function EditMarkPage() {
    const params = useParams();
    const markId = params.id as string;

    const { singleMarkQuery, updateMutation } = useMarks(markId);

    if (singleMarkQuery.isLoading) return <div className="p-8 text-center">Loading record data...</div>;
    if (singleMarkQuery.isError) return <div className="p-8 text-center text-red-500">Failed to load record.</div>;

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Edit className="w-6 h-6" /> Edit Marks Record
            </h1>

            <MarkForm
                initialData={singleMarkQuery.data}
                onSubmit={(data) => updateMutation.mutate({ id: markId, data })}
                isLoading={updateMutation.isPending}
            />
        </div>
    );
}