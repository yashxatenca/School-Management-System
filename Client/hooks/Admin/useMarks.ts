import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { marksApi } from '@/lib/admin_api/AdminMarksApi';
import { toast } from 'react-toastify';
import { IMark } from '@/interface/Marks/marks.interface';
import { useRouter } from 'next/navigation';

export const useMarks = (markId?: string) => {
    const queryClient = useQueryClient();
    const router = useRouter();

    // Fetch all marks
    const marksQuery = useQuery({
        queryKey: ['marks'],
        queryFn: marksApi.getAll,
    });

    // Fetch single mark (only if markId is provided)
    const singleMarkQuery = useQuery({
        queryKey: ['marks', markId],
        queryFn: () => marksApi.getById(markId!),
        enabled: !!markId,
    });

    // Create Mutation
    const createMutation = useMutation({
        mutationFn: marksApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['marks'] });
            toast.success('Marks added successfully!');
            router.push('/admin/marks');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to add marks');
        },
    });

    // Update Mutation
    const updateMutation = useMutation({
        mutationFn: marksApi.update,
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['marks'] });
            queryClient.invalidateQueries({ queryKey: ['marks', variables.id] });
            toast.success('Marks updated successfully!');
            router.push('/admin/marks');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to update marks');
        },
    });

    // Delete Mutation
    const deleteMutation = useMutation({
        mutationFn: marksApi.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['marks'] });
            toast.success('Marks record deleted.');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to delete record');
        },
    });

    return {
        marksQuery,
        singleMarkQuery,
        createMutation,
        updateMutation,
        deleteMutation,
    };
};