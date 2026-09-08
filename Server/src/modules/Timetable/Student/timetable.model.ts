import mongoose, { Schema } from "mongoose";
import { ITimetable } from "./timetable.interface";

const StudentTimetableSchema: Schema = new Schema(
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
    classId: {
      type: Schema.Types.ObjectId,
      ref: "Class", 
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
  mongoose.model<ITimetable>("StudentTimetable", StudentTimetableSchema);
