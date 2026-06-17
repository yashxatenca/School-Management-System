import { fetchExamswithClassId } from "@/lib/Student/Student.exam.api";
import { useQuery } from "@tanstack/react-query";

export const useGetExamWithClassId = () => {
  return useQuery({
    queryKey: ["student-exams"], // Unique descriptive key
    queryFn: fetchExamswithClassId, // Direct reference passes execution

    // Testing ke liye inhein thodi der comment karein, taaki fresh data fetch ho sake
    // staleTime: Infinity,
    // refetchOnMount: false,
    // refetchOnWindowFocus: false,
  });
};
