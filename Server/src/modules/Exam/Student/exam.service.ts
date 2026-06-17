import { ExamStudentRepo } from "./exam.repo";
export class ExamStudentService {
  static async GetExam() {
    return await ExamStudentRepo.GetMarks();
  }
}
