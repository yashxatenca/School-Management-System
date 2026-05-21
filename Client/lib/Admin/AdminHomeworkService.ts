import { api } from '@/lib/api/axios';

export interface IHomeworkData {
    title: string;
    description: string;
    classId: string;
    subjectId: string;
    hasDueDate: boolean;
    dueDate?: Date | string;
    attachments: string[];
}
const BASE_URL = '/api/v1/admin/homework';

export const homeworkService = {
    // 1. Get All Homework
    getbyAllId: async (id: string) => {
        const response = await api.get(`${BASE_URL}/${id}`);
        return response.data.data;
    },

    // 2. Get Single Homework
    getById: async (id: string) => {
        const response = await api.get(`${BASE_URL}/${id}`);
        return response.data.data;
    },

    // 3. Create Homework
    create: async (data: IHomeworkData) => {
        const response = await api.post(BASE_URL, data);
        return response.data.data;
    },

    // 4. Update Homework
    update: async (id: string, data: Partial<IHomeworkData>) => {
        const response = await api.put(`${BASE_URL}/${id}`, data);
        return response.data.data;
    },

    // 5. Delete (Soft Delete) Homework
    delete: async (id: string) => {
        const response = await api.delete(`${BASE_URL}/${id}`);
        return response.data;
    },
    findbyclassID: async (classID: string) => {
        const response = await api.get(`${BASE_URL}/class/${classID}`);
        return response.data.data;
    }
};