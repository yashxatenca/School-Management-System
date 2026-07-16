import { ApiError } from "../../../../core/errors/ApiErrors";
import { StudentTimetableRepo } from "./student.timetable.repo";
export class StudentTimetableService {
  static async getTimetable(classId: string) {
    if (!classId) throw new ApiError(400, "all details required");
    return await StudentTimetableRepo.getTimetable(classId);
  }
}
