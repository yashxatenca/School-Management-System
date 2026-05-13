import { useQuery } from "@tanstack/react-query";
import {
    GetTeacherClass,
    GetTeacherClassAll,
} from "@/lib/Teacher/TeacherClassApi";

export const useGetTeacherClass = (teacherId: string) => {
    return useQuery({
        queryKey: ["teacher-class", teacherId],
        queryFn: async () => await GetTeacherClass(teacherId),
        enabled: !!teacherId,
    });
};

export const useGetTeacherAllClass = () => {
    return useQuery({
        queryKey: ["teacher-all-class"],
        queryFn: async () => await GetTeacherClassAll(),
    });
};