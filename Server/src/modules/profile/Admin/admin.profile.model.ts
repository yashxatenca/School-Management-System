import mongoose, { Document, Schema } from 'mongoose';
import { IAdminProfile } from './admin.profile.interface'
const AdminProfileSchema: Schema = new Schema<IAdminProfile>(
  {
    authId: { type: Schema.Types.ObjectId, ref: 'Admin', required: true },
    phone: { type: String },
    designation: { type: String, uppercase: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], },
    dateOfBirth: { type: Date, },
    joiningDate: { type: Date },
    qualification: { type: String, uppercase: true },
    experienceYears: { type: Number },
    emergencyContact: { type: String },
    bio: { type: String, uppercase: true },
  },
  { timestamps: true }
);

export default mongoose.model<IAdminProfile>('AdminProfile', AdminProfileSchema);