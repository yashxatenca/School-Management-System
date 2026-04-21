import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { examApi } from '@/lib/admin_api/AdminExamApiService';

// 1. Fetch All Exams
export const useExams = () => {
    return useQuery({
        queryKey: ['exams'],
        queryFn: examApi.getAllExams,
    });
};
export const useGetExam = (id: string) => {
    return useQuery({
        queryKey: ['exam', id],
        queryFn: () => examApi.getExamById(id),
        enabled: !!id,
    });
};


// 2. Fetch Single Exam
export const useExam = (id: string) => {
    return useQuery({
        queryKey: ['exam', id],
        queryFn: () => examApi.getExamById(id),
        enabled: !!id, // Query tabhi chalegi jab ID available ho
    });
};

// 3. Create Exam Mutation
export const useCreateExam = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: examApi.createExam,
        onSuccess: () => {
            // Data naya add hua hai, toh purani list ko invalid kardo taaki fresh data aaye
            queryClient.invalidateQueries({ queryKey: ['exams'] });
        },
    });
};

// 4. Update Exam Mutation
export const useUpdateExam = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: examApi.updateExam,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['exams'] });
        },
    });
};

// 5. Delete Exam Mutation
export const useDeleteExam = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: examApi.deleteExam,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['exams'] });
        },
    });
};