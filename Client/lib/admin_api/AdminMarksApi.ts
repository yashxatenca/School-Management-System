import { api } from '../api/axios';
import { IMark } from '@/interface/Marks/marks.interface';

// Replace with your actual backend URL or use an environment variable
const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api/v1/admin/marks';

export const marksApi = {
    getAll: async (): Promise<IMark[]> => {
        const { data } = await api.get(API_URL);
        return data.data; // Assuming your backend returns { success: true, data: [...] }
    },

    getById: async (id: string): Promise<IMark> => {
        const { data } = await api.get(`${API_URL}/${id}`);
        return data.data;
    },

    create: async (markData: Partial<IMark>): Promise<IMark> => {
        const { data } = await api.post(API_URL, markData);
        return data.data;
    },

    update: async ({ id, data }: { id: string; data: Partial<IMark> }): Promise<IMark> => {
        const response = await api.put(`${API_URL}/${id}`, data);
        return response.data.data;
    },

    delete: async (id: string): Promise<void> => {
        await api.delete(`${API_URL}/${id}`);
    },
};