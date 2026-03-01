import { Document, Types } from "mongoose";

export interface ITeacherProfile extends Document {
  authId: Types.ObjectId;
  schoolId?: Types.ObjectId;

  phone?: string;
  gender?: "Male" | "Female" | "Other";
  dateOfBirth?: Date;
  qualification?: string;
  experience?: number;
  joiningDate?: Date;
  address?: string;
  profileImage?: string;

  createdAt: Date;
  updatedAt: Date;
}