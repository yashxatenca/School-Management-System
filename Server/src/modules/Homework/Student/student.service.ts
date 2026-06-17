import { ApiError } from "../../../core/errors/ApiErrors";
import { StudentHomeworkRepo } from "./student.repo";

export class StudentHomeworkService {
  static async fetchassignment(classId: string) {
    if (!classId) throw new ApiError(402, "All field required");
    return await StudentHomeworkRepo.fetchassignment(classId);
  }
}
