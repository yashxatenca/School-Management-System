// src/api/student.api.ts
import { BackendTeacherStudentApi } from '../api/axios';

// CREATE: Add a new student
export const createStudent = async (studentData: any) => {
    const { data } = await BackendTeacherStudentApi.post("/api/student/info/create", studentData);
    return data;
};

// READ ALL: Get all students
export const getStudents = async () => {
    const { data } = await BackendTeacherStudentApi.get("/api/student/info/read");
    return data;
};

// READ ONE: Get student by ID
export const getStudentById = async (studentId: string) => {
    const { data } = await BackendTeacherStudentApi.get(`/api/student/info/read/${studentId}`);
    return data;
};

// UPDATE: Update student info
export const updateStudent = async (updateData: any) => {
    console.log(updateData)
    const { data } = await BackendTeacherStudentApi.put("/api/student/info/update", updateData);
    return data;
};

// DELETE: Remove a student
export const deleteStudent = async (studentId: string) => {
    const { data } = await BackendTeacherStudentApi.delete(`/api/student/info/delete/${studentId}`);
    return data;
};
