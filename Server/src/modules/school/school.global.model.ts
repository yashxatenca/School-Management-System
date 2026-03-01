import mongoose, { Document, Schema } from 'mongoose';

export interface ISchoolInfo extends Document {
  schoolName: string;
  schoolCode: string;
  affiliationNumber: string;
  establishedYear: string;
  board: string;
  schoolType: string;
  website: string;
  supportEmail: string;
  schoolPhone: string;
  motto: string;
  address: string;
  totalStudents: number;
  totalTeachers: number;
}

const SchoolInfoSchema: Schema = new Schema(
  {
    schoolName: { type: String, required: true },
    schoolCode: { type: String, required: true, unique: true },
    affiliationNumber: { type: String, required: true },
    establishedYear: { type: String },
    board: { type: String, required: true }, // e.g., CBSE, ICSE, State Board
    schoolType: { type: String }, // e.g., Co-Ed, Boys, Girls
    website: { type: String },
    supportEmail: { type: String, required: true, lowercase: true },
    schoolPhone: { type: String, required: true },
    motto: { type: String },
    address: { type: String, required: true },
    totalStudents: { type: Number, default: 0 },
    totalTeachers: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model<ISchoolInfo>('SchoolInfo', SchoolInfoSchema);