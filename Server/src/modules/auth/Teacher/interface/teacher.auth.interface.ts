import mongoose , { Document } from "mongoose";


export interface TeacherSchema extends Document {
  name: string;
  teacher_id: string;
  email: string;
  password: string;
  role?:string;
  principalId?: mongoose.Schema.Types.ObjectId | string;

  comparePassword(candidatePassword: string): Promise<boolean>;
}