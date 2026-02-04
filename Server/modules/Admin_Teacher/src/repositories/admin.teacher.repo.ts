import { Teacher, CreateTeacherDTO } from "../interfaces/admin.interface";
import { Teacher_Model } from "../models/admin.teacher.model";

export class AdminTeacherRepo {

  // CREATE
  static async createTeacher(
    data: CreateTeacherDTO
  ): Promise<Teacher> {
    return await Teacher_Model.create(data);
  }

  // DELETE
  static async deleteTeacherById(
    id: string
  ): Promise<Teacher | null> {
    return await Teacher_Model.findByIdAndDelete(id);
  }

  // UPDATE
  static async updateTeacherByStaffId(
    staff_id: string,
    data: Partial<Teacher>
  ): Promise<Teacher | null> {
    return await Teacher_Model.findOneAndUpdate(
      { staff_id },
      { $set: data },
      {
        new: true,
        runValidators: true,
      }
    );
  }

  // READ ALL (BY PRINCIPAL)
  static async getTeachersByPrincipal(
    principalId: string
  ): Promise<Teacher[]> {
    return await Teacher_Model.find({ principalId });
  }

  // READ ONE
  static async getTeacherByStaffId(
    staff_id: string
  ): Promise<Teacher | null> {
    return await Teacher_Model.findOne({ staff_id });
  }

  // EXISTS CHECK
  static async existsByEmail(
    email: string
  ): Promise<boolean> {
    return !!(await Teacher_Model.exists({ email }));
  }
}
