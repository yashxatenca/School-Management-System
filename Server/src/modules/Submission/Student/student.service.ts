import { SubmissionRepo } from "./student.repo";
import { Homework } from "../../Homework/homework.model";
import { ApiError } from "../../../core/errors/ApiErrors";

export class SubmissionService {
  // Submit (Pehla wala same rahega)
  static async submitHomework(
    studentId: string,
    homeworkId: string,
    submissionLink: string,
    remark: string,
  ) {
    const homework = await Homework.findById(homeworkId);
    if (!homework) throw new ApiError(404, "Homework not found");

    if (homework.hasDueDate && homework.dueDate) {
      if (new Date() > new Date(homework.dueDate)) {
        throw new ApiError(
          400,
          "Submission rejected: Deadline has already passed.",
        );
      }
    }

    const existingSubmission = await SubmissionRepo.checkExistingSubmission(
      homeworkId,
      studentId,
    );
    if (existingSubmission) {
      throw new ApiError(
        400,
        "You have already submitted this assignment. Please use the edit option.",
      );
    }

    return await SubmissionRepo.createSubmission({
      homeworkId,
      studentId,
      submissionLink,
      remark,
    });
  }

  // NAYA: Edit Logic
  static async editSubmission(
    studentId: string,
    homeworkId: string,
    submissionLink: string,
    remark: string,
  ) {
    // 1. Check if submission exists
    const existingSubmission = await SubmissionRepo.checkExistingSubmission(
      homeworkId,
      studentId,
    );
    if (!existingSubmission) {
      throw new ApiError(404, "No previous submission found to edit.");
    }

    // 2. Check 1-Week (7 Days) Rule
    const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;
    const currentDate = new Date();
    const submissionDate = new Date(existingSubmission.createdAt);

    if (currentDate.getTime() - submissionDate.getTime() > ONE_WEEK_MS) {
      throw new ApiError(
        400,
        "Edit window closed. You can only edit within 7 days of your original submission.",
      );
    }

    // 3. Check Due Date Rule (Taki bachhe due date ke baad edit na kar lein)
    const homework = await Homework.findById(homeworkId);
    if (homework && homework.hasDueDate && homework.dueDate) {
      if (currentDate > new Date(homework.dueDate)) {
        throw new ApiError(
          400,
          "Cannot edit because the homework deadline has already passed.",
        );
      }
    }

    // 4. Update the Data
    const updateData = {
      submissionLink,
      remark,
      // Status change kar sakte hain agar chahein, e.g., "Updated"
    };

    return await SubmissionRepo.updateSubmission(
      existingSubmission._id as string,
      updateData,
    );
  }
}
