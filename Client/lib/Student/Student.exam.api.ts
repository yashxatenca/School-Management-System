import { api } from "@/api/axios";
export const fetchExamswithClassId = async () => {
  const { data } = await api.get(`/api/v1/student/exams`);
  return data;
};
