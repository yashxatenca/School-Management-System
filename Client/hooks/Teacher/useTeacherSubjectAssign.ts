import { useQuery, useMutation } from "@tanstack/react-query";
import { createAssignSubject, getAllAssignSubject, updateAssignSubject, deleteAssignSubject } from "../../lib/Teacher/TeacherSubjectAssign";
export const useTeacherSubjectAssign = (enable: boolean = false) => {
    return useQuery({
        queryKey: ['assign-class-subject'],
        queryFn: () => getAllAssignSubject(),
        enabled: enable
    })
}
export const useTeacherSubjectAssignMutation = () => {
    return useMutation({
        mutationFn: (data: any) => createAssignSubject(data),
    })
}

export const useTeacherSubjectAssignUpdateMutation = () => {
    return useMutation({
        mutationFn: ({ id, data }: { id: string, data: any }) => updateAssignSubject(id, data),
    })
}

export const useTeacherSubjectAssignDeleteMutation = () => {
    return useMutation({
        mutationFn: (id: string) => deleteAssignSubject(id),
    })
}