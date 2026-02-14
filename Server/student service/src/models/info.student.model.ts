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
      select: false,
    },

    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: true,
       lowercase: true,
    },

    rollNumber: {
      type: Number,
      required: true,
    },

    classId: {
     type:String, 
      required: true,
    },

    sectionId: {
      type: String,
    
      required: true,
    },
  },
  { timestamps: true }
);
// 1. Password Encryption Hook
StudentSchema.pre("save", async function () {
  // Use 'this.isModified' - no 'next' needed
  if (!this.isModified("password")) return; 

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  // Function ends, Mongoose continues automatically
});

StudentSchema.methods.comparePassword = async function (candidate: string) {
  return bcrypt.compare(candidate, this.password);
};

// 2. Student ID Generation Hook
StudentSchema.pre("save", async function () {
  if (this.studentId) return;

  const counter = await GlobalIdModel.findOneAndUpdate(
    { key: "student" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  if (counter && counter.seq > 999999) {
    throw new Error("6-digit Student ID limit exceeded");
  }

  this.studentId = String(counter?.seq).padStart(6, "0");
});


const StudentModel = mongoose.model<StudentDocument>(
  "Student",
  StudentSchema
);

export default StudentModel;

