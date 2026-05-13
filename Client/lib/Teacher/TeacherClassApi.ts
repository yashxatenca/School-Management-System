import { api } from "../api/axios";

export async function GetTeacherClass(teacherId: string) {
    return await api.get(`/api/v1/teacher/helper/${teacherId}`)
}

export async function GetTeacherClassAll() {
    return await api.get('/api/v1/teacher/class')
}