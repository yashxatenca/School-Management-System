import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { homeworkService, IHomeworkData } from '@/lib/admin_api/AdminHomeworkService';

// ----------------------------------------------------
// READ (GET) HOOKS
// ----------------------------------------------------

// Get all homeworks (Filter change hone par queryKey automatically refetch karega)
export const useGetHomeworks = (id: string) => {
    return useQuery({
        queryKey: ['homeworks', id],
        queryFn: () => homeworkService.getbyAllId(id),
    });
};

// Get single homework details
export const useGetHomeworkById = (id: string) => {
    return useQuery({
        queryKey: ['homework', id],
        queryFn: () => homeworkService.getById(id),
        enabled: !!id, // Jab tak id nahi milti tab tak API call na ho
    });
};

// ----------------------------------------------------
// WRITE (POST/PUT/DELETE) HOOKS (Mutations)
// ----------------------------------------------------

// Create Hook
export const useCreateHomework = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: IHomeworkData) => homeworkService.create(data),
        onSuccess: () => {
            // Naya assign hote hi list wali API ko wapas call karo
            queryClient.invalidateQueries({ queryKey: ['homeworks'] });
        },
    });
};


// Update Hook
export const useUpdateHomework = () => {
    const queryClient = useQueryClient();

    return useMutation({
        // useMutation me 1 hi argument pass hota hai, isliye object structure use kiya hai
        mutationFn: ({ id, data }: { id: string; data: Partial<IHomeworkData> }) =>
            homeworkService.update(id, data),
        onSuccess: (updatedData, variables) => {
            // List aur Single Homework dono ko update (refresh) kar do
            queryClient.invalidateQueries({ queryKey: ['homeworks'] });
            queryClient.invalidateQueries({ queryKey: ['homework', variables.id] });
        },
    });
};

// Delete Hook
export const useDeleteHomework = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => homeworkService.delete(id),
        onSuccess: () => {
            // Delete hote hi table list se hide kar do
            queryClient.invalidateQueries({ queryKey: ['homeworks'] });
        },
    });
};