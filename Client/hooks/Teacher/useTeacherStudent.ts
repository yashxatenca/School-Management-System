import { useQuery } from "@tanstack/react-query";
import { getStudentById, getStudents } from "@/lib/Teacher/Student.teacher.api";

export const useGetStudent = () => {
  return useQuery({
    queryKey: ["fetch-student"],
    queryFn: getStudents,
    enabled: true,
  });
};
