import { useQuery } from "@tanstack/react-query";
import {
  fetchTeacherTimetable,
  fetchClassTimetable,
} from "@/lib/Teacher/Teacher.timetable.api"; // Adjust import path

// Hook for fetching the teacher's own timetable
export const useTeacherTimetable = () => {
  return useQuery({
    queryKey: ["teacherTimetable"],
    queryFn: fetchTeacherTimetable,
  });
};

// Hook for fetching a specific class timetable
export const useClassTimetable = (classId: string) => {
  return useQuery({
    queryKey: ["classTimetable", classId],
    queryFn: () => fetchClassTimetable(classId),
    // Prevents the query from running automatically if classId is undefined/empty
    enabled: !!classId,
  });
};
