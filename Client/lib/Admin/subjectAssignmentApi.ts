import { api } from "../api/axios";
import { useQuery, useMutation } from "@tanstack/react-query";

// ==========================================
// 1. TYPES & INTERFACES
// ==========================================

export interface AssignSubjectPayload {
    teacherId: string;
    subjectId: string;
    academicYear: string;
}

export interface SubjectAssignmentResponse {
    _id: string;
    teacherId: {
        _id: string;
        name: string;
    };
    subjectId: {
        _id: string;
        name: string;
        code?: string;
    };
    academicYear: string;
    isActive: boolean;
}

// Adjust this base URL to match your Express server's routing

// If you have a configured axios instance with interceptors (for tokens), import and use it here instead of raw axios.
// import axiosInstance from './axiosInstance'; 

// ==========================================
// 2. AXIOS API SERVICE
// ==========================================

export const subjectAssignmentService = {
    // CREATE: Assign a subject to a teacher
    assignSubject: async (data: AssignSubjectPayload) => {
        const response = await api.post(`/api/v1/admin/assign/subject`, data);
        return response.data;
    },

    // READ: Get all active subject assignments
    getAllAssignments: async () => {
        const response = await api.get(`/api/v1/admin/assign/subject`);
        return response.data;
    },

    // DELETE: Remove an assignment
    deleteAssignment: async (id: string) => {
        const response = await api.delete(`/api/v1/admin/assign/subject/${id}`);
        return response.data;
    }
};

// ==========================================
// 3. REACT QUERY HOOKS
// ==========================================

/**
 * Hook to fetch all subject assignments.
 * @param enabled - Boolean to control when the query actually runs (useful for hiding table until requested)
 */
export const useGetSubjectAssignments = (enabled: boolean = true) => {
    return useQuery({
        queryKey: ["subjectAssignments"],
        queryFn: async () => {
            const res = await subjectAssignmentService.getAllAssignments();
            return res.data; // Assuming your API wraps the array in a `data` property
        },
        enabled: enabled,
    });
};

/**
 * Hook to handle creating a new subject assignment.
 */
export const useAssignSubjectMutation = () => {
    return useMutation({
        mutationFn: subjectAssignmentService.assignSubject,
    });
};

/**
 * Hook to handle deleting a subject assignment.
 */
export const useDeleteSubjectAssignmentMutation = () => {
    return useMutation({
        mutationFn: subjectAssignmentService.deleteAssignment,
    });
};