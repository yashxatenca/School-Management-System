import { useMutation, useQuery } from "@tanstack/react-query";
import { createHomework, gethomworkbyclassId } from "@/lib/Teacher/TeacherHomeworkApi";

export const usecreateHowework = () => {
    return useMutation({
        mutationFn: createHomework
    })
}

export const useGetHomeworkByClassId = (classId: string) => {
    return useQuery({
        queryKey: ['homeworks', classId],
        queryFn: () => gethomworkbyclassId(classId),
        enabled: !!classId
    })
}