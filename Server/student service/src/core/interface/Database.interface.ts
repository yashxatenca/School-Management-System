import mongoose,{ Document } from "mongoose";

export interface GlobalId extends Document {
  key: string;   // "student"
  seq: number;   // counter value
}


// dto/CreateStudentDTO.ts
export interface StudentDocument extends Document {
  studentId: string; // 6-digit numeric string
  fullName: string;
  email: string;
  password: string;
  gender: "male" | "female" | "other";
  rollNumber: number;
  classId: string;
  sectionId: string;
  comparePassword(candidate: string): Promise<boolean>;
}