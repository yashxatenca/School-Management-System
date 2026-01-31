import { BackendTeacherApi } from "../axios";
export interface Teacher {
  staff_id: string;
  name: string;
  email: string;
  contact: string;
  dateOfBirth: Date;
  gender?: "male" | "female" | "other";

  password?: string; // optional because select:false
}

export const createTeacher = async (data:Teacher) => {
  const response = await BackendTeacherApi.post("/api/admin/teacher/create", {data});
  return response.data;

};

export const fetchTeachers = async (): Promise<Teacher> => {
const { data } = await BackendTeacherApi.get(`/api/admin/teacher/read`);
   return data;

}

export const updateTeacher = async ({ id, data }: { id: string; data?: Partial<Teacher> }) => {
  const { data:response } = await BackendTeacherApi.put(`/api/admin/teacher/update`, {data, id});
  return response;
};

export const deleteTeacher = async (id: string) => {
  const { data } = await BackendTeacherApi.delete(`/api/admin/teacher/delete/${id}`);
  return data;
};

export const fetchTeacherById = async (id: string) =>{
  const { data } = await BackendTeacherApi.get(`/api/admin/teacher/${id}`)
  return data

}

export async function LogoutUser(){
    const res = await BackendTeacherApi.post("/api/teacher/auth/logout");
    
    
    return res.data;

}
