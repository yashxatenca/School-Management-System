import { api } from "@/api/axios";

export const fetchresult = async (examId: string) => {
  const { data } = await api.get(`/api/v1/student/result/${examId}`);
  return data;
};
