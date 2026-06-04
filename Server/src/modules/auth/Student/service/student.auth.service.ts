import jwt from "jsonwebtoken";
import { Types } from "mongoose";
import { StudentRepository } from "../repository/student.auth.repo";
import { StudentAuthDocument } from "../interface/student.auth.interface";
import { ClassModel } from "../../../Classes/global.class.model";
import { ApiError } from "../../../../core/errors/ApiErrors";

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_EXPIRES_IN = "1d";

export class StudentService {
  // ✅ REGISTER
  static async registerStudent(data: {
    name: string;
    email: string;
    password: string;
    teacherId?: Types.ObjectId;
    principalId?: Types.ObjectId;
  }) {
    const classId = await ClassModel.findOne({ teacherId: data.teacherId });
    if (!classId) {
      throw new ApiError(402, "Contact Admin to Add the teacher");
    }
    const student = await StudentRepository.createStudent({
      ...data,
      classId: classId._id,
    });
    return student;
  }

  // ✅ LOGIN using studentId
  static async login(studentId: string, password: string) {
    const student = await StudentRepository.findByStudentId(studentId);

    if (!student) {
      throw new Error("Invalid studentId or password");
    }

    const isMatch = await student.comparePassword(password);

    if (!isMatch) {
      throw new Error("Invalid studentId or password");
    }

    const token = this.generateToken(student);

    return {
      student: this.removePassword(student),
      token,
    };
  }

  // ✅ GET PROFILE
  static async getProfile(studentId: string) {
    const student = await StudentRepository.findById(studentId);

    if (!student) {
      throw new Error("Student not found");
    }

    return student;
  }

  // ✅ UPDATE
  static async updateStudent(id: string, updateData: any) {
    const updated = await StudentRepository.updateStudent(id, updateData);

    if (!updated) {
      throw new Error("Student not found");
    }

    return this.removePassword(updated);
  }

  // ✅ DELETE
  static async deleteStudent(id: string) {
    const deleted = await StudentRepository.deleteStudent(id);

    if (!deleted) {
      throw new Error("Student not found");
    }

    return { message: "Student deleted successfully" };
  }

  // ✅ GET STUDENTS BY TEACHER
  static async getStudentsByTeacher(teacherId: string) {
    return await StudentRepository.getStudentsByTeacher(teacherId);
  }

  // 🔐 JWT GENERATOR
  private static generateToken(student: StudentAuthDocument) {
    return jwt.sign(
      {
        id: student._id,
        studentId: student.studentId,
        principalId: student.principalId,
        teacherId: student.teacherId,
        role: "student",
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN },
    );
  }
  // get student by id

  static async getStudentById(id: string) {
    const student = await StudentRepository.findById(id);
    if (!student) {
      throw new Error("Student not found");
    }
    return this.removePassword(student);
  }

  // 🔒 REMOVE PASSWORD FROM RESPONSE
  private static removePassword(student: any) {
    const obj = student.toObject();
    delete obj.password;
    return obj;
  }
}
