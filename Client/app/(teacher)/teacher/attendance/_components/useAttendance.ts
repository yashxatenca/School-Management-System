import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  teacherMarkAttendanceAPI,
  teacherGetClassAttendanceAPI,
  teacherDeleteAttendanceAPI,
  adminGetClassCardsAPI,
  adminGetAttendanceByStudentAPI,
  adminGetAttendanceByClassAPI,
  studentGetMyAttendanceAPI,
} from "./attendance.api";
import { BulkAttendancePayload } from "./attendance.types";

// ================= TEACHER HOOKS =================

// 1. Mark or Bulk Update Attendance
export const useTeacherMarkAttendance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: BulkAttendancePayload) =>
      teacherMarkAttendanceAPI(payload),
    onSuccess: (_, variables) => {
      // Invalidate class list & date cards so UI updates immediately
      queryClient.invalidateQueries({
        queryKey: ["teacherClassAttendance", variables.classId, variables.date],
      });
      queryClient.invalidateQueries({
        queryKey: ["adminDateCards", variables.classId],
      });
    },
  });
};

// 2. Fetch Attendance for Teacher by Class & Date
export const useTeacherClassAttendance = (classId: string, date: string) => {
  return useQuery({
    queryKey: ["teacherClassAttendance", classId, date],
    queryFn: () => teacherGetClassAttendanceAPI(classId, date),
    enabled: Boolean(classId && date),
  });
};

// 3. Delete Attendance Record
export const useTeacherDeleteAttendance = (classId: string, date: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (attendanceId: string) =>
      teacherDeleteAttendanceAPI(attendanceId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["teacherClassAttendance", classId, date],
      });
    },
  });
};

// ================= ADMIN HOOKS =================

// 1. Fetch Month Date Cards
export const useAdminDateCards = (
  classId: string,
  year: number,
  month: number,
) => {
  return useQuery({
    queryKey: ["adminDateCards", classId, year, month],
    queryFn: () => adminGetClassCardsAPI(classId, year, month),
    enabled: Boolean(classId),
  });
};

// 2. Search Attendance by Student ID
export const useAdminStudentAttendance = (studentId: string, date?: string) => {
  return useQuery({
    queryKey: ["adminStudentAttendance", studentId, date],
    queryFn: () => adminGetAttendanceByStudentAPI(studentId, date),
    enabled: Boolean(studentId),
  });
};

// 3. View Attendance by Class
export const useAdminClassAttendance = (classId: string, date: string) => {
  return useQuery({
    queryKey: ["adminClassAttendance", classId, date],
    queryFn: () => adminGetAttendanceByClassAPI(classId, date),
    enabled: Boolean(classId && date),
  });
};

// ================= STUDENT HOOKS =================

// 1. Student Self Attendance Log
