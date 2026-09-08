import mongoose, { Document } from "mongoose";

export interface TeacherTimetableInterface extends Document {
  title: string;
  category: string;
  driveLink: string;
  teacherId: mongoose.Types.ObjectId | string; 
  principalId: mongoose.Types.ObjectId | string; 
  createdAt: Date;
  updatedAt: Date;
}
