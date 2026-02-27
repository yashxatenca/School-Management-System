// src/api/student.api.ts
import { api } from '../api/axios';

// CREATE: Add a new student
export const createStudent = async (studentData: any) => {
    const { data } = await api.post("/api/v1/auth/student/create", studentData);
    console.log("Created student:", data);
    return data;
};

// READ ALL: Get all students
export const getStudents = async () => {
    const { data } = await api.get("/api/v1/auth/student/read");
    return data;
};

// READ ONE: Get student by ID
export const getStudentById = async (studentId: string) => {
    const { data } = await api.get(`/api/v1/auth/student/read/${studentId}`);
    return data;
};

// UPDATE: Update student info
export const updateStudent = async (updateData: any) => {
    const { data } = await api.put(`/api/v1/auth/student/update/${updateData._id}`, updateData);
    return data;
};

// DELETE: Remove a student
export const deleteStudent = async (studentId: string) => {
    const { data } = await api.delete(`/api/v1/auth/student/delete/${studentId}`);
    return data;
};
