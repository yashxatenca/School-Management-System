// models/School.model.ts

import mongoose, { Schema, Document } from 'mongoose';
import { ISchoolProfile } from "./school.global.interface"  // Adjust path as needed

// Extend the Document interface with our ISchoolProfile
export interface ISchoolDocument extends ISchoolProfile, Document { }

const SchoolSchema = new Schema<ISchoolDocument>(
    {
        authId: {
            type: String, // Or mongoose.Schema.Types.ObjectId if referencing a User model directly
            required: true,
            ref: 'Admin', // Change 'User' to whatever your auth/admin model is named
        },
        schoolName: {
            type: String,
            trim: true
        },
        board: {
            type: String,
            trim: true
        },
        affiliationNumber: {
            type: String,
            trim: true
        },
        principalName: {
            type: String,
            trim: true
        },
        establishedYear: {
            type: Number
        },
        schoolEmail: {
            type: String,
            trim: true,
            lowercase: true
        },
        schoolPhone: {
            type: String,
            trim: true
        },
        website: {
            type: String,
            trim: true
        },
        address: {
            type: String,
            trim: true
        },
    },
    {
        timestamps: true // Automatically adds createdAt and updatedAt
    }
);

export const School = mongoose.models.School || mongoose.model<ISchoolDocument>('School', SchoolSchema);