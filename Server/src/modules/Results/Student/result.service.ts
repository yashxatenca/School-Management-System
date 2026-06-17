import resultRepository from "./result.repo";
import Exam from "../../Exam/exam.model"; // Exam type check karne ke liye

class ResultService {
  async fetchStudentResult(
    student_Id: string,
    exam_Id: string,
    class_Id: string,
    academicYear: string,
  ) {
    // 1. Exam ka type pata karo
    const examDetails = await Exam.findById(exam_Id);
    if (!examDetails) {
      throw new Error("Exam not found in database");
    }

    // 2. Agar Annual Exam hai toh aggregation logic call karo
    if (
      examDetails.type === "annual" ||
      examDetails.name.toLowerCase().includes("annual")
    ) {
      const annualData = await resultRepository.aggregateAnnualResults(
        student_Id,
        class_Id,
        academicYear,
      );

      // Aggregated data ko wapas Result Schema jaisa format karo taaki frontend break na ho
      return annualData.map((res) => {
        const percentage =
          (res.overallTotalObtained / res.overallMaxMarks) * 100;
        const isPass = percentage >= 33;

        // Basic grading logic (Aap apne hisab se change kar sakte ho)
        let grade = "F";
        if (percentage >= 90) grade = "A+";
        else if (percentage >= 80) grade = "A";
        else if (percentage >= 70) grade = "B+";
        else if (percentage >= 60) grade = "B";
        else if (percentage >= 50) grade = "C";
        else if (percentage >= 33) grade = "D";

        return {
          _id: res._id,
          subjectId: { _id: res._id, name: res.subjectDetails.name },
          examId: examDetails,
          marks: {
            theoryObtained: res.totalTheory,
            practicalObtained: res.totalPractical,
            totalObtained: res.overallTotalObtained,
            maxTotalMarks: res.overallMaxMarks,
          },
          grade: grade,
          isPass: isPass,
          remarks: isPass ? "Promoted to next class" : "Needs Improvement",
        };
      });
    }

    // 3. Agar normal Term Exam hai, toh seedha fetch karo
    return await resultRepository.findTermResults(
      student_Id,
      exam_Id,
      class_Id,
      academicYear,
    );
  }
}

export default new ResultService();
