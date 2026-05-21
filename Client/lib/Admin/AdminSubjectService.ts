import { api } from "../api/axios";

export const subjectService = {
    getAll: () => api.get('/api/v1/admin/subject').then(res => res.data),
    create: (data: any) => api.post('/api/v1/admin/subject', data).then(res => res.data),
    update: (id: string, data: any) => api.patch(`/api/v1/admin/subject/${id}`, data).then(res => res.data),
    delete: (id: string) => api.delete(`/api/v1/admin/subject/${id}`).then(res => res.data),
};