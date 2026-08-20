import { useQuery } from "@tanstack/react-query";
// Aapki student API wali file ka correct path
import { getStudentsByClassAPI } from "@/lib/Admin/AdminStudentApi";

export const useGetStudentsByClass = (classId: string) => {
  return useQuery({
    queryKey: ["studentsByClass", classId],
    queryFn: () => getStudentsByClassAPI(classId),
    enabled: !!classId,
    retry: false,
  });
};
