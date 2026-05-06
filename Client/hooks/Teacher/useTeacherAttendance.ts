import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { getstudentattendanceapi, createStudentAttendanceApi } from "@/lib/Teacher/teacher.attendance.api";

export const useGetStudentAttendance = () => {
    return useQuery({
        queryKey: ["attendance", "student"],
        queryFn: getstudentattendanceapi,

        onSuccess: (data) => {
            toast.success(data?.message || "Students loaded ✅");
        },

        onError: (error: any) => {
            toast.error(error?.message || "Failed to load students ❌");
        },

        staleTime: 1000 * 60 * 5, // 5 min caching
    });
};
export const useCreateAttendance = () => {
    return useMutation({
        mutationFn: createStudentAttendanceApi,

        onSuccess: (data) => {
            toast.success(data?.message || "Attendance saved ✅");
        },

        onError: (error: any) => {
            toast.error(error?.message || "Failed to save attendance ❌");
        },
    });
};