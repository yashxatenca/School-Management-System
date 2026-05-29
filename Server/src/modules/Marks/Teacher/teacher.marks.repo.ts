import MarkModel from "../marks.model";
import { IMark } from "../marks.interface";

export class TeacherMarksRepo {
  static async createMark(data: IMark) {
    return await MarkModel.create(data);
  }

  static async getMarkById(id: string) {
    return await MarkModel.findById(id)
      .populate("studentId", "name rollNumber") // Adjust fields based on your auth model
      .populate("subjects.subjectId", "name code");
  }

  static async getMarksByExamAndClass(examId: string, classId: string) {
    return await MarkModel.find({ examId, classId }).populate(
      "studentId",
      "name rollNumber",
    );
  }

  static async getMarksByStudent(studentId: string) {
    return await MarkModel.find({ studentId })
      .populate("examId", "name date")
      .sort({ createdAt: -1 });
  }

  static async updateMark(id: string, data: Partial<IMark>) {
    return await MarkModel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  }

  static async deleteMark(id: string) {
    return await MarkModel.findByIdAndDelete(id);
  }
  static async checkmarks(id: string) {
    return await MarkModel.findOne({ studentId: id });
  }
}
