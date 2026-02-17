import { ApiError } from "../../core/errors/ApiErrors";
import { CreateTeacherDTO, Teacher } from "../../interfaces/admin.interface";
import { AdminTeacherRepo } from "../../repositories/admin.teacher.repo";

export class AdminTeacherService {

  static async CreateTeacher(data: CreateTeacherDTO, princiapId: string) {
    if (!data) throw new ApiError(400, "Invalid input");

    const existing = await AdminTeacherRepo.findByEmail(data.email);
    if (existing) {
      throw new ApiError(409, "Email already exists");
    }

    return await AdminTeacherRepo.createTeacher(data, princiapId);
  }

  static async ReadAllTeacher() {
    return await AdminTeacherRepo.getAllTeachers();
  }

  static async GetById(id: string) {
    if (!id) throw new ApiError(400, "ID required");
    return await AdminTeacherRepo.getTeacherById(id);
  }

  static async UpdateTeacher(id: string, data: Partial<Teacher>) {
    if (!id || !data) throw new ApiError(400, "Invalid update data");

    if (data.email) {
      const emailHolder = await AdminTeacherRepo.findByEmail(data.email);
      if (emailHolder && emailHolder._id.toString() !== id) {
        throw new ApiError(409, "Email already in use");
      }
    }

    delete (data as any).password;

    return await AdminTeacherRepo.updateTeacherById(id, data);
  }

  static async DeleteTeacher(id: string) {
    if (!id) throw new ApiError(400, "ID required");
    return await AdminTeacherRepo.deleteTeacherById(id);
  }
}
