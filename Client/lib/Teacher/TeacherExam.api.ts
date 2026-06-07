import { api } from "../../api/axios";
export const getMarks = async () => {
  return api.get("/api/v1/teacher/exams/");
};
