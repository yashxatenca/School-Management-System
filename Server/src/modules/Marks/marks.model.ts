import mongoose, { Schema, Document } from "mongoose";
import { IMark } from "./marks.interface";
// 1. Define the TypeScript Interface

// 2. Define the Mongoose Schema
const MarkSchema: Schema = new Schema(
  {
    examId: {
      type: Schema.Types.ObjectId,
      ref: "Exam",
      required: true,
    },
    studentId: {
      type: Schema.Types.ObjectId,
      ref: "StudentAuth",
      required: true,
    },
    teacherId: {
      type: Schema.Types.ObjectId,
      ref: "TeacherAuth",
      required: true,
    },
    principalId: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
    },
    classId: {
      type: Schema.Types.ObjectId,
      ref: "Class", // Replace with your actual Class model name
      required: true,
    },

    // Array to hold marks for multiple subjects in this single exam
    subjects: [
      {
        subjectId: {
          type: String,
          ref: "Subject",
          required: true,
        },
        maxMarks: {
          type: Number,
          required: true,
          default: 100,
        },
        passingMarks: {
          type: Number,
          required: true,
          default: 33,
        },
        obtainedMarks: {
          type: Number,
          required: true,
          min: 0,
        },
        grade: {
          type: String,
        },
        remarks: {
          type: String,
          trim: true,
        },
      },
    ],

    // Aggregate data for the whole exam
    totalMaxMarks: {
      type: Number,
      required: true,
    },
    totalObtainedMarks: {
      type: Number,
      required: true,
    },
    percentage: {
      type: Number,
      required: true,
    },
    overallGrade: {
      type: String,
    },
    resultStatus: {
      type: String,
      enum: ["Pass", "Fail", "Promoted", "Withheld"],
      required: true,
    },
    remarks: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

// Create a compound index to ensure a student only has ONE mark document per exam
MarkSchema.index({ examId: 1, studentId: 1 }, { unique: true });

export default mongoose.models.Mark ||
  mongoose.model<IMark>("Mark", MarkSchema);
