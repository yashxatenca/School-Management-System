import { ApiError } from "../../../../core/errors/ApiErrors";
import { TeacherTimetableInterface } from "../teacher.timetable.interface";
import { TeacherTimetableRepo } from "./teacher.timetable.admin.repo";

export class TeacherTimetableService {
  static async create(data: TeacherTimetableInterface) {
    if (
      !data.title ||
      !data.category ||
      !data.driveLink ||
      !data.teacherId ||
      !data.principalId
    ) {
      throw new ApiError(400, "Missing required fields");
    }
    return await TeacherTimetableRepo.create(data);
  }

  static async getById(id: string) {
    if (!id) throw new ApiError(400, "Timetable ID is required");
    const timetable = await TeacherTimetableRepo.findById(id);
    if (!timetable) throw new ApiError(404, "Timetable not found");
    return timetable;
  }

  static async getByClassId(teacherId: string) {
    if (!teacherId) throw new ApiError(400, "Class ID is required");
    return await TeacherTimetableRepo.findByTeacherId(teacherId);
  }
  static async delete(id: string) {
    if (!id) throw new ApiError(400, "Timetable ID is required");
    return await TeacherTimetableRepo.delete(id);
  }
}
