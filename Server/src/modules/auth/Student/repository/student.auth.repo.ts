import { Types } from "mongoose";
import { StudentAuth } from "../models/student.auth.model";
import { StudentAuthDocument } from "../interface/student.auth.interface";

export class StudentRepository {

  // ✅ CREATE STUDENT (studentId auto-generated in model)
  static async createStudent(data: {
    name: string;
    email: string;
    password: string;
    teacherId?: Types.ObjectId;
    principalId?: Types.ObjectId;
    classId?: Types.ObjectId;
  }): Promise<StudentAuthDocument> {

    const user = await StudentAuth.create(data);
    return user;
  }

  // ✅ UPDATE STUDENT by _id
  static async updateStudent(
    id: string,
    updateData: Partial<{
      name: string;
      email: string;
      password: string;
      teacherId?: Types.ObjectId;
      principalId?: Types.ObjectId;
    }>
  ): Promise<StudentAuthDocument | null> {
    return await StudentAuth.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );
  }

  // ✅ DELETE STUDENT by _id
  static async deleteStudent(
    id: string
  ): Promise<StudentAuthDocument | null> {
    return await StudentAuth.findByIdAndDelete(id);
  }

  // ✅ READ ALL STUDENTS by teacherId
  static async getStudentsByTeacher(
    teacherId: string
  ): Promise<StudentAuthDocument[]> {
    return await StudentAuth.find({
      teacherId: new Types.ObjectId(teacherId),
    }).select("-password");
  }

  // ✅ FIND STUDENT by studentId (FOR LOGIN)
  static async findByStudentId(
    studentId: string
  ): Promise<StudentAuthDocument | null> {
    return await StudentAuth.findOne({ studentId })
      .select("+password"); // needed for login
  }

  // ✅ FIND STUDENT by _id (Profile)
  static async findById(
    id: string
  ): Promise<StudentAuthDocument | null> {
    return await StudentAuth.findById(id)
      .select("-password");
  }

  // (Optional) ✅ FIND BY EMAIL (future use)
  static async findByEmail(
    email: string
  ): Promise<StudentAuthDocument | null> {
    return await StudentAuth.findOne({ email })
      .select("+password");
  }
}