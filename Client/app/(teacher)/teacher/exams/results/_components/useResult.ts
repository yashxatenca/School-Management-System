// hooks/useStudentResult.ts
import { useQuery } from "@tanstack/react-query";
import { fetchStudentResult } from "./Result.api";

export const useStudentResult = (
  examId: string,
  studentId: string,
  isEnabled: boolean,
) => {
  return useQuery({
    queryKey: ["studentResult", examId, studentId],
    queryFn: () => fetchStudentResult(examId, studentId),
    enabled: isEnabled && !!examId && !!studentId, // Sirf tab chalega jab button click ho aur IDs present hon
    retry: 1, // Ek baar fail hone par retry karega
    staleTime: 5 * 60 * 1000, // 5 minutes tak data fresh manega
  });
};
