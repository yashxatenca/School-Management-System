import mongoose, { Document, Schema } from 'mongoose';

export interface IAdminProfile extends Document {
  name: string;
  email: string;
  phone: string;
  role: string;
  designation: string;
  gender: string;
  dateOfBirth: Date;
  joiningDate: Date;
  qualification: string;
  experienceYears: number;
  emergencyContact: string;
  bio: string;
  profileStatus: 'ACTIVE' | 'SUSPENDED';
}

const AdminProfileSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String, required: true },
    role: { type: String, default: 'SUPER_ADMIN' },
    designation: { type: String, required: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
    dateOfBirth: { type: Date },
    joiningDate: { type: Date, default: Date.now },
    qualification: { type: String },
    experienceYears: { type: Number, default: 0 },
    emergencyContact: { type: String },
    bio: { type: String },
    profileStatus: { type: String, enum: ['ACTIVE', 'SUSPENDED'], default: 'ACTIVE' },
  },
  { timestamps: true }
);

export default mongoose.model<IAdminProfile>('AdminProfile', AdminProfileSchema);