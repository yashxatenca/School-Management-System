import { api } from "../api/axios";

// ➕ CREATE
export const createNotice = async (noticeData: any) => {
  return await api.post(`/api/v1/teacher/notice/create`, noticeData);
};

// 📖 READ (Fetch notices by classId)
export const readNotices = async (classId: string) => {
  // Axios mein query parameters bhejne ka sabse clean tarika 'params' object use karna hai
  return await api.get(`/api/v1/teacher/notice/list`, {
    params: { classId },
  });
};

// 🗑️ DELETE (Delete notice by ID)
export const deleteNotice = async (noticeId: string) => {
  return await api.delete(`/api/v1/teacher/notice/delete/${noticeId}`);
};

// ✏️ UPDATE (Agar future mein edit ka option dena ho)
export const updateNotice = async (noticeId: string, noticeData: any) => {
  return await api.put(`/api/v1/teacher/notice/update/${noticeId}`, noticeData);
};
