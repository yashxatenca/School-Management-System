import { Document, Types } from "mongoose";

export interface IHomeworkSubmission extends Document {
  homeworkId: Types.ObjectId;
  studentId: Types.ObjectId;
  submissionLink: string;
  remark?: string;
  status: "Submitted" | "Late" | "Graded";
  createdAt: Date;
  updatedAt: Date;
}
