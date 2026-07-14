import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  TimetableAPI,
  CreateTimetableDTO,
  UpdateTimetableDTO,
} from "../../lib/Admin/Admin.timetable.student.api";

// --- QUERIES (Fetch Data) ---

export const useGetTimetablesByClass = (classId: string) => {
  return useQuery({
    queryKey: ["timetables", classId],
    queryFn: () => TimetableAPI.getByClassId(classId),
    enabled: !!classId, // Only run if classId exists
  });
};

export const useGetTimetableById = (id: string) => {
  return useQuery({
    queryKey: ["timetable", id],
    queryFn: () => TimetableAPI.getById(id),
    enabled: !!id,
  });
};

// --- MUTATIONS (Modify Data) ---

export const useCreateTimetable = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateTimetableDTO) => TimetableAPI.create(data),
    onSuccess: () => {
      // Refresh all timetables to show the new one
      queryClient.invalidateQueries({ queryKey: ["timetables"] });
    },
  });
};

export const useUpdateTimetable = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTimetableDTO }) =>
      TimetableAPI.update({ id, data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["timetables"] });
    },
  });
};

export const useDeleteTimetable = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => TimetableAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["timetables"] });
    },
  });
};
