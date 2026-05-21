import { api } from "../api/axios"
export const createHomework = async (data: any) => {
    return api.post('/api/v1/teacher/homework', data)
}

export const gethomworkbyclassId = async (classId: string) => {
    return api.get(`/api/v1/teacher/homework/class/${classId}`)
}