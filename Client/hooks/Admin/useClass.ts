import { useQuery } from '@tanstack/react-query';
// Aapki class API wali file ka correct path
import { classService } from '@/lib/admin_api/AdminClassService';

export const useGetClasses = () => {
    return useQuery({
        queryKey: ['classes'],
        queryFn: classService.getAll,
    });
};