import { ApiError } from "../../../core/errors/ApiErrors";
import { TeacherMarkRepo } from "./teacher.exam.repo";

export class TeacherMarkService {
  static async readmarks(role: string) {
    if (!role) throw new ApiError(402, "details are missing");
    if (role === "teacher") {
      return await TeacherMarkRepo.readMarks();
    }
    return;
  }
}
