import { ApiError } from "../../../core/errors/ApiErrors";
import { TeacherResultRepository } from "./teacher.result.repo";

export class MarkService {
  private markRepository: TeacherResultRepository;

  constructor() {
    this.markRepository = new TeacherResultRepository();
  }

  public async generateReportCard(examId: string, studentId: string) {
    if (!examId || !studentId) throw new ApiError(400, "All field required");
    const data = await this.markRepository.getStudentResult(examId, studentId);

    if (!data) {
      throw new Error("RESULT_NOT_FOUND");
    }

    const { markData, schoolData } = data;

    // Map the raw DB data to the exact format needed by the React component
    return {
      schoolName: schoolData?.schoolName || "School Name Not Available",
      schoolAddress: schoolData?.address || "Address Not Available",
      examName: (markData.examId as any)?.name || "Term Examination",
      student: {
        name: (markData.studentId as any)?.name || "N/A",
        studentId: (markData.studentId as any)?.studentId || "N/A",
        class: `${(markData.classId as any)?.name || ""} - ${(markData.classId as any)?.section || ""}`,
      },
      subjects: markData.subjects.map((sub: any) => ({
        name: sub.subjectId, // If subjectId is populated, use sub.subjectId.name
        max: sub.maxMarks,
        passing: sub.passingMarks,
        obtained: sub.obtainedMarks,
        grade: sub.grade || "-",
        remarks: sub.remarks || "",
      })),
      summary: {
        totalMax: markData.totalMaxMarks,
        totalObtained: markData.totalObtainedMarks,
        percentage: markData.percentage.toFixed(2),
        overallGrade: markData.overallGrade || "-",
        resultStatus: markData.resultStatus,
      },
    };
  }
}
