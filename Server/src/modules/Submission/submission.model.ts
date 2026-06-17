import mongoose, { Schema } from "mongoose";
import { IHomeworkSubmission } from "./submission.interface";

const HomeworkSubmissionSchema = new Schema<IHomeworkSubmission>(
  {
    homeworkId: {
      type: Schema.Types.ObjectId,
      ref: "Homework",
      required: true,
    },
    studentId: {
      type: Schema.Types.ObjectId,
      ref: "Student", // Apna actual student model name likhein
      required: true,
    },
    submissionLink: {
      type: String,
      required: true,
    },
    remark: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["Submitted", "Late", "Graded"],
      default: "Submitted",
    },
  },
  { timestamps: true },
);

// Ek student ek homework ek hi baar submit kar paye
HomeworkSubmissionSchema.index(
  { homeworkId: 1, studentId: 1 },
  { unique: true },
);

export const HomeworkSubmission =
  mongoose.models.HomeworkSubmission ||
  mongoose.model<IHomeworkSubmission>(
    "HomeworkSubmission",
    HomeworkSubmissionSchema,
  );
