import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcrypt";
import GlobalIdModel from "./global.student.id.models";
import { StudentDocument } from "../core/interface/Database.interface";


const StudentSchema = new Schema<StudentDocument>(
  {
    studentId: {
      type: String,
      unique: true,
      index: true,
      minlength: 6,
      maxlength: 6,
    },

    fullName: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },

    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: true,
    },

    rollNumber: {
      type: Number,
      required: true,
    },

    classId: {
      type: Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },

    sectionId: {
      type: Schema.Types.ObjectId,
      ref: "Section",
      required: true,
    },
  },
  { timestamps: true }
);
StudentSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

StudentSchema.methods.comparePassword = async function (
  candidate: string
) {
  return bcrypt.compare(candidate, this.password);
};

StudentSchema.pre("save", async function (next) {
  if (this.studentId) return next();

  const counter = await GlobalIdModel.findOneAndUpdate(
    { key: "student" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  if (counter.seq > 999999) {
    throw new Error("6-digit Student ID limit exceeded");
  }

  this.studentId = String(counter.seq).padStart(6, "0");
  next();
});

const StudentModel = mongoose.model<StudentDocument>(
  "Student",
  StudentSchema
);

export default StudentModel;

