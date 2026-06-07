import { api } from "../../api/axios";

export const getTeacherAllSubject = async () => {
  return api.get("/api/v1/teacher/subject");
};
