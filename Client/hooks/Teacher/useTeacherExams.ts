import { useQuery } from "@tanstack/react-query";
import { getMarks } from "@/lib/Teacher/TeacherExam.api";

export const useTeacherExam = () => {
  return useQuery({
    queryKey: ["get-exams"],
    queryFn: getMarks,
    enabled: true,
  });
};
