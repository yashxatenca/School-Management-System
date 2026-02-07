import { Types } from "mongoose";
import { Request } from "express";
import { Document } from "mongoose";
export type Role = "admin" | "teacher" 
export interface Teacher extends Document {
  staff_id: string;
  role?:string;
  name: string;
  email: string;
  contact: string;
  dateOfBirth: Date;
  gender?: "male" | "female" | "other";

  password: string; // optional because select:false

  principalId: Types.ObjectId | string;
  teacherDetails?: Types.ObjectId[] | string[];

  createdAt?: Date;
  updatedAt?: Date;
}
export interface JwtUser {
  id: string;
  email: string;
  role: Role;
}

// interfaces/teacher.dto.ts
export interface CreateTeacherDTO {
  staff_id: string;
  name: string;
  contact: string;
  principalId: string;
  password: string;
  email: string;
  dateOfBirth: Date;
  gender?: "male" | "female" | "other";
}


