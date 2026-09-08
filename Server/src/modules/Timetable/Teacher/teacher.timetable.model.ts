import mongoose, { Schema } from "mongoose";
import { TeacherTimetableInterface } from "./teacher.timetable.interface";

const TeacherTimetableSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      uppercase: true,
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      uppercase: true,
      trim: true,
    },
    driveLink: {
      type: String,
      required: [true, "Drive Link is required"],
      validate: {
        validator: function (v: string) {
          return v.includes("drive.google.com");
        },
        message: "Must be a valid Google Drive link!",
      },
    },
    teacherId: {
      type: Schema.Types.ObjectId,
      ref: "TeacherAuth", 
      required: [true, "Class ID is required for student mapping"],
    },
    principalId: {
      type: Schema.Types.ObjectId,
      ref: "Admin", 
      required: [true, "Principal ID is required for data isolation"],
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.Timetable ||
  mongoose.model<TeacherTimetableInterface>(
    "TeacherTimetable",
    TeacherTimetableSchema,
  );
