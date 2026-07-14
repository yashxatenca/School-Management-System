import { api } from "@/api/axios";
export const fetchTeacherTimetable = async () => {
  return await api.get("/api/v1/teacher/timetable/my-timetable");
};

export const fetchClassTimetable = async (classId: string) => {
  return await api.get(`/api/v1/teacher/timetable/class/${classId}`);
};
