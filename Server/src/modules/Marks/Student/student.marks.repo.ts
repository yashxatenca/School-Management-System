import Marks from "../marks.model";
export class StudentMarksRepo {
  static async getMarksByStudentIdAndExamId(studentId: string, examId: string) {
    return await Marks.findOne({
      studentId: studentId,
      examId: examId,
    })
      .populate("classId")
      .populate("studentId")
      .populate("examId")
      .populate("teacherId")
      .populate("subjects.subjectId");
  } 
}
