import { Teacher, CreateTeacherDTO } from "../interfaces/admin.interface";
import { Teacher_Model } from "../models/admin.teacher.model";
export class AdminTeacherRepo {

  static async createTeacher(data: CreateTeacherDTO, principalId: string) {
    return await Teacher_Model.create({ ...data, principalId });
  }

  static async getAllTeachers() {
    return await Teacher_Model.find().lean();
  }

  static async getTeacherById(id: string) {
    return await Teacher_Model.findById(id).lean();
  }

  static async updateTeacherById(id: string, data: Partial<Teacher>) {
    return await Teacher_Model.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    ).lean();
  }

  static async deleteTeacherById(id: string) {
    return await Teacher_Model.findByIdAndDelete(id);
  }

  static async findByEmail(email: string) {
    return await Teacher_Model.findOne({ email }).lean();
  }
}
