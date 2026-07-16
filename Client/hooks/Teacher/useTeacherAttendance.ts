import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  getstudentattendanceapi,
  createStudentAttendanceApi,
  fetchClassAttendanceApi,
  deleteAttendanceApi,
} from "@/lib/Teacher/teacher.attendance.api";

// 1. Hook: Get Students List
export const useGetStudentAttendance = () => {
  return useQuery({
    queryKey: ["attendance", "student"],
    queryFn: getstudentattendanceapi,
    staleTime: 1000 * 60 * 5, // 5 min caching
    retry: false,
    refetchOnWindowFocus: false,
  });
};

// 2. Hook: Create or Edit Attendance
export const useCreateAttendance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createStudentAttendanceApi,
    onSuccess: (data, variables) => {
      toast.success(data?.message || "Attendance saved successfully ✅");

      // 🔥 Automatically refresh the specific date we just saved/updated
      queryClient.invalidateQueries({
        queryKey: ["classAttendance", variables.classId, variables.date],
      });
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to save attendance ❌");
    },
  });
};

// 3. Hook: Fetch Attendance Records (For a Specific Date)
export const useFetchClassAttendance = (
  params: {
    classId: string;
    date: string;
  } | null,
) => {
  return useQuery({
    // Adding date to queryKey ensures it refetches when the date changes in the UI
    queryKey: ["classAttendance", params?.classId, params?.date],
    queryFn: () => fetchClassAttendanceApi(params!),
    enabled: !!params?.classId && !!params?.date, // Runs ONLY if classId and date exist
    staleTime: 1000 * 60 * 5,
  });
};

// 4. Hook: Delete Attendance Record
export const useDeleteAttendance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAttendanceApi,
    onSuccess: (data, variables) => {
      toast.success(data?.message || "Attendance deleted successfully 🗑️");

      // 🔥 After deleting, refresh that specific date so the UI clears the grid
      queryClient.invalidateQueries({
        queryKey: ["classAttendance", variables.classId, variables.date],
      });
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to delete attendance ❌");
    },
  });
};
  