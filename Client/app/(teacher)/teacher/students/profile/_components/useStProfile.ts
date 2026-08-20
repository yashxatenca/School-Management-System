import { useQuery } from "@tanstack/react-query";
import { getStudentProfile } from "./student.profile.api";

export const useStudentProfile = (studentId: string) => {
  return useQuery({
    queryKey: ["studentProfile", studentId],
    queryFn: () => getStudentProfile(studentId),
    enabled: !!studentId, // Tabhi chalega jab studentId available ho
  });
};
