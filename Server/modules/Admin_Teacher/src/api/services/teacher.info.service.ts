import { ApiError } from "../../core/errors/ApiErrors";
import { CreateTeacherDTO, Teacher } from "../../interfaces/admin.interface";
import { AdminTeacherRepo } from "../../repositories/admin.teacher.repo";

export class AdminTeacherService {

  static async CreateTeacher(
    data: CreateTeacherDTO,
    principalId: string
  ): Promise<Teacher> {

    if (!data || !principalId) {
      throw new ApiError(400, "Invalid input data");
    }

    const exists = await AdminTeacherRepo.existsByEmail(data.email);
    if (exists) {
      throw new ApiError(409, "Teacher already exists");
    }

    return await AdminTeacherRepo.createTeacher({
      ...data,
      principalId,
    });
  }

  static async ReadAllTeacher(
    principalId: string
  ): Promise<Teacher[]> {
    if (!principalId) {
      throw new ApiError(401, "Unauthorized");
    }

    return await AdminTeacherRepo.getTeachersByPrincipal(principalId);
  }

  static async ReadByStaffId(
    staff_id: string
  ): Promise<Teacher | null> {
    if (!staff_id) {
      throw new ApiError(400, "Staff ID required");
    }

    return await AdminTeacherRepo.getTeacherByStaffId(staff_id);
  }

  static async UpdateTeacher(
    staff_id: string,
    data: Partial<Teacher>
  ): Promise<Teacher | null> {

    if (!staff_id || !data) {
      throw new ApiError(400, "Update data required");
    }

    return await AdminTeacherRepo.updateTeacherByStaffId(staff_id, data);
  }

  static async DeleteTeacher(
    id: string
  ): Promise<Teacher | null> {
    if (!id) {
      throw new ApiError(400, "Teacher ID required");
    }

    return await AdminTeacherRepo.deleteTeacherById(id);
  }
}
