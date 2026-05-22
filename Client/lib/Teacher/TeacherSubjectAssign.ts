import { api } from "../api/axios";
export async function createAssignSubject(data: any) {
  return await api.post("/api/v1/teacher/assign-class-subject/assign", data);
}
export async function getAllAssignSubject() {
  return await api.get("/api/v1/teacher/assign-class-subject/assign");
}
export async function updateAssignSubject(id: string, data: any) {
  return await api.put(
    `/api/v1/teacher/assign-class-subject/assign/${id}`,
    data,
  );
}
export async function deleteAssignSubject(id: string) {
  return await api.delete(`/api/v1/teacher/assign-class-subject/assign/${id}`);
}
