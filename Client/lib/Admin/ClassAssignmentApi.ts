import { api } from "../api/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export interface AssignClassPayload {
    teacherId: string;
    classId: string;
    academicYear: string;
}

// ================= API CALLS =================

// CREATE
export const assignClassApi = async (data: AssignClassPayload) => {
    const response = await api.post("/api/v1/admin/assign/class", data);
    return response.data;
};

// READ (🔥 SAFE)
export const fetchAssignmentsApi = async () => {
    const response = await api.get("/api/v1/admin/assign/class/");

    // 🔥 NEVER RETURN UNDEFINED
    return response?.data?.data || [];
};

// UPDATE
export const updateAssignmentApi = async ({
    id,
    data,
}: {
    id: string;
    data: Partial<AssignClassPayload>;
}) => {
    const response = await api.put(`/api/v1/admin/assign/class/update/${id}`, data);
    return response.data;
};

// DELETE
export const deleteAssignmentApi = async (id: string) => {
    const response = await api.delete(`/api/v1/admin/assign/class/${id}`);
    return response.data;
};

// ================= TANSTACK HOOKS =================

// 🔥 CONTROLLED FETCH
export const useGetAssignments = (enabled: boolean) => {
    return useQuery({
        queryKey: ["classAssignments"],
        queryFn: fetchAssignmentsApi,
        enabled, // 🔥 button control
        initialData: [], // 🔥 no crash ever
    });
};

// CREATE
export const useAssignClassMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: assignClassApi,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["classAssignments"] });
        },
    });
};

// UPDATE
export const useUpdateAssignmentMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateAssignmentApi,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["classAssignments"] });
        },
    });
};

// DELETE
export const useDeleteAssignmentMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteAssignmentApi,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["classAssignments"] });
        },
    });
};