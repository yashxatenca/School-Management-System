import mongoose, { Document } from "mongoose";

export interface classassignmodel extends Document {
  classId: mongoose.Types.ObjectId;
  subjectId: [mongoose.Types.ObjectId];
  classTeacherId: mongoose.Types.ObjectId | string;
  principalId: mongoose.Types.ObjectId | string;
}
