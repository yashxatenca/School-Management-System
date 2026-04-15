import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { subjectService } from '@/lib/admin_api/AdminSubjectService'; // Path apne hisaab se adjust kar lena

// ----------------------------------------------------
// READ (GET) HOOKS
// ----------------------------------------------------

// 1. Get all subjects
export const useGetSubjects = () => {
    return useQuery({
        queryKey: ['subjects'],
        queryFn: subjectService.getAll,
    });
};

// ----------------------------------------------------
// WRITE (POST/PATCH/DELETE) HOOKS (Mutations)
// ----------------------------------------------------

// 2. Create Subject Hook
export const useCreateSubject = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: any) => subjectService.create(data),
        onSuccess: () => {
            // Naya subject add hote hi list wali API ko wapas call karo
            queryClient.invalidateQueries({ queryKey: ['subjects'] });
        },
    });
};

// 3. Update Subject Hook
export const useUpdateSubject = () => {
    const queryClient = useQueryClient();

    return useMutation({
        // useMutation expects a single argument, so we pass an object
        mutationFn: ({ id, data }: { id: string; data: any }) =>
            subjectService.update(id, data),
        onSuccess: () => {
            // Update hone ke baad list refresh karo
            queryClient.invalidateQueries({ queryKey: ['subjects'] });
        },
    });
};

// 4. Delete Subject Hook
export const useDeleteSubject = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => subjectService.delete(id),
        onSuccess: () => {
            // Delete hote hi table list se hat jayega
            queryClient.invalidateQueries({ queryKey: ['subjects'] });
        },
    });
};