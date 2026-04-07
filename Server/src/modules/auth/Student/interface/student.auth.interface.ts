import { Document, Types } from "mongoose";

export interface StudentAuthDocument extends Document {
  name: string;
  studentId: string;
  email: string;
  password: string;

  teacherId?: Types.ObjectId;
  principalId?: Types.ObjectId;
  schoolId?: Types.ObjectId;
  classId?: Types.ObjectId;

  comparePassword(candidatePassword: string): Promise<boolean>;
}