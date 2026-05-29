import { TeacherMarksRepo } from "./teacher.marks.repo";
import { IMark } from "../marks.interface";
import { ApiError } from "../../../core/errors/ApiErrors";
export class MarksService {
  static async createMark(data: IMark) {
    if (!data) {
      throw new ApiError(404, "all details are required");
    }
    const existmarks = await TeacherMarksRepo.checkmarks(
      data.studentId.toString(),
    );
    if (existmarks) throw new ApiError(404, "User Data already exists");
    return await TeacherMarksRepo.createMark(data);
  }

  static async getMarkById(id: string) {
    const mark = await TeacherMarksRepo.getMarkById(id);
    if (!mark) throw new Error("Mark record not found");
    return mark;
  }

  static async getMarks(filters: {
    examId?: string;
    classId?: string;
    studentId?: string;
  }) {
    if (filters.studentId) {
      return await TeacherMarksRepo.getMarksByStudent(filters.studentId);
    }
    if (filters.examId && filters.classId) {
      return await TeacherMarksRepo.getMarksByExamAndClass(
        filters.examId,
        filters.classId,
      );
    }
    throw new Error(
      "Please provide either studentId or both examId and classId",
    );
  }

  static async updateMark(id: string, data: Partial<IMark>) {
    const updatedMark = await TeacherMarksRepo.updateMark(id, data);
    if (!updatedMark) throw new Error("Mark record not found");
    return updatedMark;
  }

  static async deleteMark(id: string) {
    const deletedMark = await TeacherMarksRepo.deleteMark(id);
    if (!deletedMark) throw new Error("Mark record not found");
    return deletedMark;
  }
}
