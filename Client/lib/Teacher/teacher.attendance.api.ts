import { api } from "../../api/axios";

export const getstudentattendanceapi = async () => {
  try {
    const { data } = await api.get("/api/v1/teacher/attendance/get-students");
    return data;
  } catch (error: any) {
    throw error?.response?.data || { message: "Something went wrong" };
  }
};
export const createStudentAttendanceApi = async (payload: any) => {
  try {
    const { data } = await api.post(
      "/api/v1/teacher/attendance/create",
      payload,
    );
    return data;
  } catch (error: any) {
    throw error?.response?.data || { message: "Something went wrong" };
  }
};
