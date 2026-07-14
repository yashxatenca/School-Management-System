import mongoose, { Document } from "mongoose";

export interface ITimetable extends Document {
  title: string;
  category: string;
  driveLink: string;
  classId: mongoose.Types.ObjectId | string; // Added Class ID
  principalId: mongoose.Types.ObjectId | string; // Added Principal/Admin ID
  createdAt: Date;
  updatedAt: Date;
}
