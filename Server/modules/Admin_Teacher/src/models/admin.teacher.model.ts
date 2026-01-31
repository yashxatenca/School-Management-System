import mongoose, { Schema } from "mongoose";
import type { Teacher } from "../interfaces/admin.interface.js";
import bcrypt from 'bcrypt'
const TeacherSchema: Schema<Teacher> = new Schema(
  {
    staff_id: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    role:{
      type:String,
      default:"teacher"
    },

    password: {
      type: String,
      required: true,
      select: false, // hides password from queries
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
      trim: true,
    },

    contact: {
      type: String,
      required: true,
    },

    dateOfBirth: {
      type: Date,
      required: true,
    },

    gender: {
      type: String,
      enum: ["male", "female", "other"],
      default: "other",
    },

    principalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Principal_Data",
      required: true,
    },

    teacherDetails: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "teacher_details",
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
//saving password in hash to avoid hacking

TeacherSchema.pre("save", async function () {
  const user = this as Teacher;

  if (!user.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
});





export const Teacher_Model = mongoose.model<Teacher>(
  "Teacher_Data",
  TeacherSchema
);
