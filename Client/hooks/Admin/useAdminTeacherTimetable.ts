import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  TimetableAPI,
  CreateTimetableDTO,
  UpdateTimetableDTO,
} from "../../lib/Admin/Admin.timetable.teacher.api";

// --- QUERIES (Fetch Data) ---

export const useGetTimetablesByTeacher = (teacherId: string) => {
  return useQuery({
    queryKey: ["timetables", teacherId],
    queryFn: () => TimetableAPI.getByClassId(teacherId),
    enabled: !!teacherId, // Only run if classId exists
  });
};

export const useGetTeacherTimetableById = (id: string) => {
  return useQuery({
    queryKey: ["timetable", id],
    queryFn: () => TimetableAPI.getById(id),
    enabled: !!id,
  });
};

// --- MUTATIONS (Modify Data) ---

export const useCreateTeacherTimetable = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateTimetableDTO) => TimetableAPI.create(data),
    onSuccess: () => {
      // Refresh all timetables to show the new one
      queryClient.invalidateQueries({ queryKey: ["timetables"] });
    },
  });
};

export const useUpdateTeacherTimetable = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTimetableDTO }) =>
      TimetableAPI.update({ id, data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["timetables"] });
    },
  });
};

export const useDeleteTeacherTimetable = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => TimetableAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["timetables"] });
    },
  });
};
