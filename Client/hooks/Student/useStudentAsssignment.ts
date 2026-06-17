import { fetchAssignment } from "@/lib/Student/Student.assignment.api";
import { useQuery } from "@tanstack/react-query";

export const useStudentFetchAssignment = (classId: string) => {
  return useQuery({
    // 1. Added a descriptive string to avoid cache collisions
    queryKey: ["assignment", classId],

    // 2. Properly invoking the function and passing the parameter
    queryFn: () => fetchAssignment(classId),

    // Optional: Add this if you don't want it to run when classId is missing
    enabled: !!classId,
  });
};
