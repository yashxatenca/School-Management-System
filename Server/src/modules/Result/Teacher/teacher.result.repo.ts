import { School } from "../../school/admin.school.model";
import marksModel from "../../Marks/marks.model";

export class TeacherResultRepository {
  public async getStudentResult(examId: string, studentId: string) {
    // 1. Fetch the mark and populate related entities
    const markData = await marksModel
      .findOne({ examId, studentId })
      .populate("examId", "name") // Adjust field name based on your Exam model
      .populate("studentId", "name studentId") // Adjust based on StudentAuth model
      .populate("classId", "name section") // Adjust based on Class model
      .populate("subjects.subjectId", "name")
      .lean();

    if (!markData) {
      return null;
    }

    // 2. Fetch the school data using the principalId attached to the mark
    const schoolData = await School.findOne({ authId: markData.principalId })
      .select("schoolName address")
      .lean();
    return { markData, schoolData };
  }
}
