import { api } from "@/api/axios";

export const getStudentProfile = async (studentId: string) => {
  const { data } = await api.get(
    `/api/v1/teacher/profile/student/${studentId}`,
  );
  return data.profile;
};
