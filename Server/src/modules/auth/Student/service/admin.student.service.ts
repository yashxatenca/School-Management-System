
import { Types } from "mongoose";
import { AdminStudentRepository } from "../repository/admin.student.repo";
import { StudentAuthDocument } from "../interface/student.auth.interface";
export class AdminStudentService {

    static async FindByStudentId(studentId: string) {
        const student = await AdminStudentRepository.findbystudentId(studentId);
        if (!student) {
            throw new Error("Student not found");
        }
        return student;
    }

    static async FindByEmail(email: string) {
        const student = await AdminStudentRepository.findbyemail(email);
        if (!student) {
            throw new Error("Student not found");
        }
        return student;
    }

    static async FindById(id: string) {
        const student = await AdminStudentRepository.findbyid(id);
        if (!student) {
            throw new Error("Student not found");
        }
        return student;
    }

    static async FindByClass(classId: string) {
        const student = await AdminStudentRepository.findbyclass(classId);
        if (!student) {
            throw new Error("Student not found");
        }
        return student;
    }

    static async UpdateStudent(id: string, updateData: Partial<StudentAuthDocument>) {
        const student = await AdminStudentRepository.updateStudent(id, updateData);
        if (!student) {
            throw new Error("Student not found");
        }
        return student;
    }

    static async DeleteStudent(id: string) {
        const student = await AdminStudentRepository.deleteStudent(id);
        if (!student) {
            throw new Error("Student not found");
        }
        return student;
    }


}