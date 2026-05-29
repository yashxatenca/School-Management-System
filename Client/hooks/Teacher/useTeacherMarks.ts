import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createMark,
  getMarks,
  getMarkById,
  updateMark,
  deleteMark,
  CreateMarkPayload,
} from "@/lib/Teacher/TeacherMarks.api"; // Apna path adjust karein

// 1. Query Keys (Caching ko manage karne ke liye)
export const MARKS_KEYS = {
  all: ["marks"] as const,
  lists: () => [...MARKS_KEYS.all, "list"] as const,
  list: (filters: any) => [...MARKS_KEYS.lists(), { filters }] as const,
  details: () => [...MARKS_KEYS.all, "detail"] as const,
  detail: (id: string) => [...MARKS_KEYS.details(), id] as const,
};

// ---------------------------------------------------
// QUERIES (Data Fetch karne ke liye)
// ---------------------------------------------------

// Get All Marks (with filters)
export const useGetMarks = (filters?: {
  examId?: string;
  classId?: string;
  studentId?: string;
}) => {
  return useQuery({
    queryKey: MARKS_KEYS.list(filters),
    queryFn: () => getMarks(filters),
    // Agar examId ya classId nahi hai toh query run nahi hogi (optional check)
    // enabled: !!filters?.examId && !!filters?.classId,
  });
};

// Get Single Mark by ID
export const useGetMarkById = (id: string) => {
  return useQuery({
    queryKey: MARKS_KEYS.detail(id),
    queryFn: () => getMarkById(id),
    enabled: !!id, // ID hone par hi API call karega
  });
};

// ---------------------------------------------------
// MUTATIONS (Data Create, Update, Delete karne ke liye)
// ---------------------------------------------------

// Create Mark
export const useCreateMark = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateMarkPayload) => createMark(data),
    onSuccess: () => {
      // Naya result add hone par list ko invalidate karo taaki fresh data fetch ho
      queryClient.invalidateQueries({ queryKey: MARKS_KEYS.lists() });
    },
  });
};

// Update Mark
export const useUpdateMark = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<CreateMarkPayload>;
    }) => updateMark(id, data),
    onSuccess: (data, variables) => {
      // List aur specific detail dono update karo
      queryClient.invalidateQueries({ queryKey: MARKS_KEYS.lists() });
      queryClient.invalidateQueries({
        queryKey: MARKS_KEYS.detail(variables.id),
      });
    },
  });
};

// Delete Mark
export const useDeleteMark = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteMark(id),
    onSuccess: () => {
      // Delete hone ke baad list ko refresh karo
      queryClient.invalidateQueries({ queryKey: MARKS_KEYS.lists() });
    },
  });
};
