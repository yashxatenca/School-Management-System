import { fetchresult } from "@/lib/Student/Student.result.api";
import { useQuery } from "@tanstack/react-query";

export const useFetchResult = (examId: string) => {
  return useQuery({
    queryKey: ["fetchresult", examId],
    queryFn: () => fetchresult(examId),
    enabled: false,
  });
};
