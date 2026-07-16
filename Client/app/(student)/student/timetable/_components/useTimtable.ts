// src/hooks/useTimetable.ts
import { useQuery } from "@tanstack/react-query";
import { fetchTimetable } from "./timetable.api";
export const useClassTimetables = (classId: string | undefined) => {
  return useQuery({
    queryKey: ["timetables", classId],
    queryFn: () => fetchTimetable(classId as string),

    enabled: !!classId,
    staleTime: 5 * 60 * 1000,
  });
};
