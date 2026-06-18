import Marks from "../marks.model";
export class StudentMarksRepo {
  static async getMarksByStudentIdAndExamId(studentId: string, examId: string) {
    console.log(studentId, examId);
    console.log("req in the repio");
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
