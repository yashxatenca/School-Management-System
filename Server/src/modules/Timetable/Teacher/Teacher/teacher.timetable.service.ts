import { ApiError } from "../../../../core/errors/ApiErrors";
import { TeacherTimetableRepo } from "./teacher.timetable.repo";
export class TeacherTimetableService {
  static async getTimetable(userId: string) {
    if (!userId) throw new ApiError(400, "all field required");
    return await TeacherTimetableRepo.getTimetable(userId);
  }
  static async getClassTimetable(classId: string) {
    if (!classId) throw new ApiError(400, "all field required");
    return await TeacherTimetableRepo.getClassTimetable(classId);
  }
}
