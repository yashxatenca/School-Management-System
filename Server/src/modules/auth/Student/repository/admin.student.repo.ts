import { Types } from "mongoose";
import { StudentAuth } from "../models/student.auth.model";
import { StudentAuthDocument } from "../interface/student.auth.interface";

export class AdminStudentRepository {
    static async findbystudentId(studentId: string) {
        return await StudentAuth.findOne({ studentId })
    }

    static async findbyemail(email: string) {
        return await StudentAuth.findOne({ email })
    }

    static async findbyid(id: string) {
        return await StudentAuth.findById(id)
    }

    static async findbyclass(classId: string) {
        return await StudentAuth.find({ classId: new Types.ObjectId(classId) })
    }

    static async updateStudent(id: string, updateData: Partial<StudentAuthDocument>) {
        return await StudentAuth.findByIdAndUpdate(id, updateData, { new: true })
    }

    static async deleteStudent(id: string) {
        return await StudentAuth.findByIdAndDelete(id)
    }

}