import { api } from "../../api/axios";

// 1. Get Students List
export const getstudentattendanceapi = async () => {
  try {
    const { data } = await api.get("/api/v1/teacher/attendance/get-students");
    return data;
  } catch (error: any) {
    throw error?.response?.data || { message: "Failed to fetch students" };
  }
};

// 2. Create / Update (Edit) Attendance
// Since your backend uses `upsert: true`, sending a POST to this route
// will create it if it doesn't exist, and update it if it does.
export const createStudentAttendanceApi = async (payload: any) => {
  try {
    const { data } = await api.post(
      "/api/v1/teacher/attendance/create",
      payload,
    );
    return data;
  } catch (error: any) {
    throw error?.response?.data || { message: "Failed to save attendance" };
  }
};

// 3. Fetch Attendance (Single Date)
export const fetchClassAttendanceApi = async (params: {
  classId: string;
  date: string;
}) => {
  try {
    const { classId, date } = params;
    const { data } = await api.get(
      `/api/v1/teacher/attendance/class/${classId}`,
      {
        params: { date }, // Sends ?date=YYYY-MM-DD
      },
    );
    return data;
  } catch (error: any) {
    throw error?.response?.data || { message: "Failed to fetch attendance" };
  }
};

// 4. Delete Attendance (Single Date)
export const deleteAttendanceApi = async ({
  classId,
  date,
}: {
  classId: string;
  date: string;
}) => {
  try {
    const { data } = await api.delete(
      `/api/v1/teacher/attendance/class/${classId}?date=${date}`,
    );
    return data;
  } catch (error: any) {
    throw error?.response?.data || { message: "Failed to delete attendance" };
  }
};
