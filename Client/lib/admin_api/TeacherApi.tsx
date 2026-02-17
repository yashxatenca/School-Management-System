import { BackendTeacherApi } from "../axios";
import { Teacher, TeachersResponse, SingleTeacherResponse} from '../../interface/Teacher.interface'


/* ---------------- CREATE ---------------- */

export const createTeacher = async (payload: Teacher) => {
  const { data }    = await BackendTeacherApi.post("/api/admin/teacher/create", { data: payload });
  return data;
};

/* ---------------- READ ---------------- */

export const fetchTeachers = async () => {
  const { data } = await BackendTeacherApi.get("/api/admin/teacher/read");
  return data;
};

export const fetchTeacherById = async (id: string) => {
  const { data } = await BackendTeacherApi.get(`/api/admin/teacher/${id}`);
  return data;
};

export const updateTeacher = async (id: string, payload: Partial<Teacher>) => {
  const { data } = await BackendTeacherApi.put(
    `/api/admin/teacher/update/${id}`,
    { data: payload }
  );
  return data;
};

export const deleteTeacher = async (id: string) => {
  const { data } = await BackendTeacherApi.delete(
    `/api/admin/teacher/delete/${id}`
  );
  return data;
};

/* ---------------- AUTH ---------------- */
export async function LogoutUser() {
  const res = await BackendTeacherApi.post("/api/teacher/auth/logout");
  return res.data;
}