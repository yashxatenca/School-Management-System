import mongoose, { Schema } from "mongoose";
import { ITeacherProfile } from "./teacher.profile.interface";

const TeacherProfileSchema = new Schema<ITeacherProfile>(
  {
    authId: {
      type: Schema.Types.ObjectId,
      ref: "TeacherAuth",
      required: true,
      unique: true,
    },

    schoolId: {
      type: Schema.Types.ObjectId,
      ref: "School",
    },

    phone: String,
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },
    dateOfBirth: Date,
    qualification: String,
    experience: Number,
    joiningDate: Date,
    address: String,
    profileImage: String,
  },
  { timestamps: true }
);

export default mongoose.model<ITeacherProfile>(
  "TeacherProfile",
  TeacherProfileSchema
);