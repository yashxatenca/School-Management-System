import mongoose, { Schema, Document } from "mongoose";

export interface IStudentProfile extends Document {
  student_id: string;
  gender?: string;
  dob?: string;
  bloodGroup?: string;
  phone?: string;
  address?: string;
  fatherName?: string;
  motherName?: string;
  contact?: string; // Emergency Contact
}

const StudentProfileSchema: Schema = new Schema(
  {
    student_id: { type: String, required: true, unique: true, index: true },
    gender: { type: String },
    dob: { type: String },
    bloodGroup: { type: String },
    phone: { type: String },
    address: { type: String },
    fatherName: { type: String },
    motherName: { type: String },
    contact: { type: String },
  },
  { timestamps: true },
);

export default mongoose.model<IStudentProfile>(
  "StudentProfile",
  StudentProfileSchema,
);
