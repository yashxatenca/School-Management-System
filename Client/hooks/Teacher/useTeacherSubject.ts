import { useQuery } from "@tanstack/react-query";
import { getTeacherAllSubject } from "@/lib/Teacher/TeacherSubjectApi";

export const useGetSubject = () => {
    return useQuery({
        queryKey: ["teacher-subjects"],
        queryFn: getTeacherAllSubject,
    })

}

