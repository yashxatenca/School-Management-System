import mongoose from "mongoose";
import Result from "../result.model";

class ResultRepository {
  // Normal Term Exam Result Fetch
  async findTermResults(
    student_Id: string,
    exam_Id: string,
    class_Id: string,
    academicYear: string,
  ) {
    return await Result.find({
      studentId: student_Id,
      examId: exam_Id,
      classId: class_Id,
      academicYear,
    })
      .populate("subjectId", "name")
      .populate("examId", "name type")
      .populate("gradedBy", "name");
  }

  // Annual Exam Aggregation (Pure class/year ka data combine karega)
  async aggregateAnnualResults(
    student_Id: string,
    class_Id: string,
    academicYear: string,
  ) {
    return await Result.aggregate([
      // 1. Uss student, class aur year ke saare exams filter karo
      {
        $match: {
          studentId: new mongoose.Types.ObjectId(student_Id),
          classId: new mongoose.Types.ObjectId(class_Id),
          academicYear: academicYear,
        },
      },
      // 2. Subject ke hisab se marks ko sum (add) karo
      {
        $group: {
          _id: "$subjectId",
          totalTheory: { $sum: "$marks.theoryObtained" },
          totalPractical: { $sum: "$marks.practicalObtained" },
          overallTotalObtained: { $sum: "$marks.totalObtained" },
          overallMaxMarks: { $sum: "$marks.maxTotalMarks" },
        },
      },
      // 3. Subject ka naam laane ke liye Subjects collection se join karo
      {
        $lookup: {
          from: "subjects", // Database me Subject collection ka exact naam
          localField: "_id",
          foreignField: "_id",
          as: "subjectDetails",
        },
      },
      { $unwind: "$subjectDetails" },
    ]);
  }
}

export default new ResultRepository();
