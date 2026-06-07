import { api } from "../../api/axios";

const API_URL = "/api/v1/admin/exam"; // Apka backend route
export const examApi = {
  // Saare exams fetch karna
  getAllExams: async () => {
    const response = await api.get(API_URL);
    return response.data.data;
  },

  // Single exam fetch karna (Edit ke liye)
  getExamById: async (id: string) => {
    const response = await api.get(`${API_URL}/${id}`);
    return response.data.data;
  },

  // Naya exam create karna
  createExam: async (examData: any) => {
    const response = await api.post(API_URL, examData);
    return response.data;
  },

  // Exam update karna
  updateExam: async ({ id, data }: { id: string; data: any }) => {
    const response = await api.put(`${API_URL}/${id}`, data);
    return response.data;
  },

  // Exam delete karna
  deleteExam: async (id: string) => {
    const response = await api.delete(`${API_URL}/${id}`);
    return response.data;
  },
};
