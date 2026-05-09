import { api } from "../api/axios";

export async function GetTeacherClass(teacherId: string) {
    return api.get(`/api/v1/teacher/helper/${teacherId}`)
}