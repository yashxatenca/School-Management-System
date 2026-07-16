import { api } from "@/api/axios";

export const fetchTimetable = async (classId: string) => {
  return await api.get(`/api/v1/student/timetable/class/${classId}`);
};
