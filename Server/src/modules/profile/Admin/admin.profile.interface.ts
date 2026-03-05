import mongoose, { Document, Schema } from 'mongoose';

export interface IAdminProfile extends Document {
  authId?: mongoose.Types.ObjectId;
  designation?: string;
  gender?: string;
  dateOfBirth?: Date;
  joiningDate?: Date;
  qualification?: string;
  experienceYears?: number;
  emergencyContact?: string;
  bio?: string;
}