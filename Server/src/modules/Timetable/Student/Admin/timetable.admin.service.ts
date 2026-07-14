import { ApiError } from "../../../../core/errors/ApiErrors";
import { ITimetable } from "../timetable.interface";
import { StudentTimetableRepo } from "./timetable.admin.repo";

export class StudentTimetableService {
  static async create(data: ITimetable) {
    if (
      !data.title ||
      !data.category ||
      !data.driveLink ||
      !data.classId ||
      !data.principalId
    ) {
      throw new ApiError(400, "Missing required fields");
    }
    return await StudentTimetableRepo.create(data);
  }

  static async getById(id: string) {
    if (!id) throw new ApiError(400, "Timetable ID is required");
    const timetable = await StudentTimetableRepo.findById(id);
    if (!timetable) throw new ApiError(404, "Timetable not found");
    return timetable;
  }

  static async getByClassId(classId: string) {
    if (!classId) throw new ApiError(400, "Class ID is required");
    return await StudentTimetableRepo.findByClassId(classId);
  }

  static async update(id: string, data: Partial<ITimetable>) {
    if (!id) throw new ApiError(400, "Timetable ID is required");
    if (!data || Object.keys(data).length === 0) {
      throw new ApiError(400, "Data to update is required");
    }
    return await StudentTimetableRepo.update(id, data);
  }

  static async delete(id: string) {
    if (!id) throw new ApiError(400, "Timetable ID is required");
    return await StudentTimetableRepo.delete(id);
  }
}
