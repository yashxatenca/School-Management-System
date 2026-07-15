// services/result.service.ts
import { ResultData } from "./Result.interface";
import { api } from "@/api/axios";
export const fetchStudentResult = async (
  examId: string,
  studentId: string,
): Promise<ResultData> => {
  return await api.get(`/api/v1/teacher/result/${examId}/${studentId}`);
};
