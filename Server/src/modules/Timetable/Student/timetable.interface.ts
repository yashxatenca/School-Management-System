import mongoose, { Document } from "mongoose";

export interface ITimetable extends Document {
  title: string;
  category: string;
  driveLink: string;
  classId: mongoose.Types.ObjectId | string; 
  principalId: mongoose.Types.ObjectId | string; 
  createdAt: Date;
  updatedAt: Date;
}
