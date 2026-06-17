import Exam from "../exam.model";
export class ExamStudentRepo {
  static async GetMarks() {
    return await Exam.find();
  }
}
