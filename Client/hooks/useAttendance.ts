import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api/axios';

const markClassAttendanceAPI = async (payload: any) => {
    const res = await api.post(`/api/v1/admin/attendance/bulk`, payload);
    return res.data;
};

export const useMarkClassAttendance = () => {
    return useMutation({
        mutationFn: markClassAttendanceAPI,
        onSuccess: () => alert("Attendance saved successfully!"),
        onError: () => alert("Error saving attendance.")
    });
};
