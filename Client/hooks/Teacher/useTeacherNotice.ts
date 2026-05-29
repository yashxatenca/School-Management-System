import {
  createNotice,
  deleteNotice,
  readNotices,
} from "@/lib/Teacher/TeacherNotice.api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { isErrored } from "stream";

export const useGetNotices = (classId: string, isenabed: boolean) => {
  return useQuery({
    queryKey: ["notices", classId],
    // ✅ Yahan ek arrow function lagana zaroori hai
    queryFn: () => readNotices(classId),
    enabled: !!classId && isenabed,
  });
};

export const useCreateNotice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createNotice, // Yeh bilkul theek tha
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notices"] });
    },
  });
};

export const useDeleteNotice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    // ✅ Yahan id receive karke fir function ko pass karna hai
    mutationFn: (id: string) => deleteNotice(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notices"] });
    },
  });
};
