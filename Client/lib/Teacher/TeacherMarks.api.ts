import { api } from "../api/axios"; // Apna axios instance import karein

// TypeScript interface (Optional but recommended for React + TS)
export interface CreateMarkPayload {
  examId: string;
  studentId: string;
  teacherId: string;
  classId: string;
  principalId?: string;
  subjects: any[]; // Aap isko proper type de sakte hain
  totalMaxMarks: number;
  totalObtainedMarks: number;
  percentage: number;
  overallGrade: string;
  resultStatus: string;
  remarks?: string;
}

// 1. CREATE - Naya result add karne ke liye
export const createMark = async (data: CreateMarkPayload) => {
  const response = await api.post("api/v1/teacher/marks/", data);
  return response.data;
};

// 2. GET ALL / FILTER - Class aur Exam ke basis par sabhi students ke marks lane ke liye
export const getMarks = async (filters?: {
  examId?: string;
  classId?: string;
  studentId?: string;
}) => {
  // Axios params object automatically query string bana deta hai (?examId=...&classId=...)
  const response = await api.get("api/v1/teacher/marks/", { params: filters });
  return response.data;
};

// 3. GET BY ID - Kisi ek specific result ko uske ID se lane ke liye
export const getMarkById = async (id: string) => {
  const response = await api.get(`api/v1/teacher/marks/${id}`);
  return response.data;
};

// 4. UPDATE - Result edit karne ke liye
export const updateMark = async (
  id: string,
  data: Partial<CreateMarkPayload>,
) => {
  const response = await api.put(`api/v1/teacher/marks/${id}`, data);
  return response.data;
};

// 5. DELETE - Result delete karne ke liye
export const deleteMark = async (id: string) => {
  const response = await api.delete(`api/v1/teacher/marks/${id}`);
  return response.data;
};
