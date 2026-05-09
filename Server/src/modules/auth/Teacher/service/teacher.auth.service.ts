import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { TeacherRepository } from "../repository/teacher.auth.repository";

export class TeacherService {

  private repository = new TeacherRepository();

  // CREATE (Admin Only)
  async createTeacher(data: {
    name: string;
    teacher_id: string;
    email: string;
    password: string;
    principalId?: string;
  }) {

    const existing = await this.repository.findByEmail(data.email);
    if (existing) {
      throw new Error("Teacher already exists");
    }

    return await this.repository.create(data);
  }

  // READ
  async getTeacherById(id: string) {
    const teacher = await this.repository.findById(id);
    if (!teacher) throw new Error("Teacher not found");
    return teacher;
  }

  // UPDATE
  async updateTeacher(id: string, data: any) {
    const updated = await this.repository.update(id, data);
    if (!updated) throw new Error("Teacher not found");
    return updated;
  }

  async getProfilebyId(id: string) {
    if (!id) throw new Error("Unauthorized");
    const teacher = await this.repository.findById(id);
    if (!teacher) throw new Error("Teacher not found");
    return teacher;
  }

  // DELETE
  async deleteTeacher(id: string) {
    const deleted = await this.repository.delete(id);
    if (!deleted) throw new Error("Teacher not found");
    return deleted;
  }

  async getAllTeachers(principalId: string) {
    return await this.repository.findAll(principalId);
  }

  // LOGIN
  async login(email: string, password: string) {

    const teacher = await this.repository.findByEmail(email);
    if (!teacher) {
      throw new Error("Invalid credentials");
    }

    const isMatch = await teacher.comparePassword(password);
    if (!isMatch) {
      throw new Error("Invalid credentials");
    }
    const token = this.generateToken(teacher._id.toString(), teacher.principalId)
    return { token, teacher };
  }

  private generateToken(id: string, principalId?: string) {
    return jwt.sign(
      { id, role: "teacher", principalId },

      process.env.JWT_SECRET as string,
      {
        expiresIn: "1d",
        audience: "school-management",
        issuer: "auth-service"
      }
    );
  }
}