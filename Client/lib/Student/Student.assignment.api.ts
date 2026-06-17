import { api } from "@/api/axios";

export const fetchAssignment = (classId: string) => {
  return api.get(`/api/v1/student/assignment/${classId}`);
};
