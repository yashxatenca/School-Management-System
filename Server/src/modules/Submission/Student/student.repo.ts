import { HomeworkSubmission } from "../submission.model";

export class SubmissionRepo {
  static async checkExistingSubmission(homeworkId: string, studentId: string) {
    return await HomeworkSubmission.findOne({ homeworkId, studentId });
  }

  static async createSubmission(data: any) {
    const submission = new HomeworkSubmission(data);
    return await submission.save();
  }

  
  static async updateSubmission(submissionId: string, updateData: any) {
    return await HomeworkSubmission.findByIdAndUpdate(
      submissionId,
      updateData,
      { new: true },
    );
  }
}
