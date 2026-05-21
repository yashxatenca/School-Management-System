import { useMutation, useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/axios';
import { fetchTeachers } from '@/lib/Admin/TeacherApi';
export const useGetTeachers = () => {
    return useQuery({
        queryKey: ["teachers"],
        queryFn: () => fetchTeachers()
    });
};