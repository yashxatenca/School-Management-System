
import { Types, Document } from "mongoose";
export interface IClass extends Document {
  name: string; // Example: 10
  section: string; // Example: A

  schoolId: Types.ObjectId;
  teacherId: Types.ObjectId;

  subjects: Types.ObjectId[];

  academicYear: string;

  strength?: number;
  principalId?: Types.ObjectId;

  isActive: boolean;

  createdBy?: Types.ObjectId | string;
  updatedBy?: Types.ObjectId | string;

  createdAt?: Date;
  updatedAt?: Date;
}
