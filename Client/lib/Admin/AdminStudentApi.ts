import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../api/axios";
import { classService } from "@/lib/Admin/AdminClassService";

const getStudentByIdAPI = async (studentId: string) => {
  if (!studentId) return null;
  const res = await api.get(`api/v1/admin/student/${studentId}`);
  return res.data.data;
};

export const getStudentsByClassAPI = async (classId: string) => {
  if (!classId) return null;
  const res = await api.get(`api/v1/admin/student/class/${classId}`);
  return res.data.data;
};

export const useGetClasses = () => {
  return useQuery({
    queryKey: ["classes"],
    queryFn: classService.getAll,
  });
};

export const useGetStudentById = (studentId: string) => {
  return useQuery({
    queryKey: ["student", studentId],
    queryFn: () => getStudentByIdAPI(studentId),
    enabled: !!studentId,
    retry: false,
  });
};

export const useGetStudentsByClass = (classId: string) => {
  return useQuery({
    queryKey: ["studentsByClass", classId],
    queryFn: () => getStudentsByClassAPI(classId),
    enabled: !!classId,
    retry: false,
  });
};

export interface CreateStudentPayload {
  name: string;
  email: string;
  password?: string;
  teacherId: string;
  classId: string;
  schoolId: string;
  principalId?: string;
}

export const studentService = {
  create: async (payload: CreateStudentPayload) => {
    const { data } = await api.post("/api/v1/admin/student", payload);
    return data;
  },
};
export const deleteStudentAPI = async (studentId: string) => {
  const res = await api.delete(`/api/v1/admin/student/${studentId}`);
  return res.data;
};

export const updateStudentAPI = async (studentId: string, payload: any) => {
  const res = await api.put(`/api/v1/admin/student/${studentId}`, payload);
  return res.data;
};

export const useUpdateStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) =>
      updateStudentAPI(id, payload),
    onSuccess: (data, variables) => {
      // Success hone par purana cache clear karke naya data fetch karega
      queryClient.invalidateQueries({ queryKey: ["student", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["studentsByClass"] });
    },
  });
};

export const bulkUpdateStudentsAPI = async (payload: {
  studentIds: string[];
  classId?: string;
  teacherId?: string;
}) => {
  const response = await api.patch(
    "/api/v1/admin/student/bulk-update",
    payload,
  );
  return response.data;
};

export const useBulkUpdateStudents = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bulkUpdateStudentsAPI,
    onSuccess: () => {
      // Invalidate relevant student and class queries to keep UI fresh
      queryClient.invalidateQueries({ queryKey: ["studentsByClass"] });
      queryClient.invalidateQueries({ queryKey: ["student"] });
    },
  });
};
