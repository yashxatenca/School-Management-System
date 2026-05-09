import { useQuery, useMutation } from "@tanstack/react-query";
import { GetTeacherClass } from "@/lib/Teacher/TeacherClassApi";
import { useDispatch } from "react-redux";
export const useGetTeacherClass = (teacherId: string) => {
    return useQuery({
        queryKey: ["teacher-class", teacherId],
        queryFn: () => GetTeacherClass(teacherId),
    });
};