import ExamModel from "../exam.model";
import { IExam } from "../exam.interface";
export class TeacherMarkRepo {
  static async readMarks() {
    return await ExamModel.find();
  }
}
