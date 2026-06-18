import { ApiError } from "../../../core/errors/ApiErrors";
import { StudentMarksRepo } from "./student.marks.repo";

export class StudentMarksService {
  static async GetMarksByStudentIdAndExamId(studentId: string, examId: string) {
    if (!examId || !studentId) throw new ApiError(400, "Required Credentails");
    return await StudentMarksRepo.getMarksByStudentIdAndExamId(
      studentId,
      examId,
    );
  }
}
