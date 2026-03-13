/* =================================
CLASS INTERFACE
================================= */
import { Types, Document } from "mongoose";
export interface IClass extends Document {
    name: string; // Example: 10
    section: string; // Example: A

    schoolId: Types.ObjectId;

    subjects: Types.ObjectId[];

    academicYear: string;

    strength?: number;

    isActive: boolean;

    createdBy?: Types.ObjectId;
    updatedBy?: Types.ObjectId;

    createdAt?: Date;
    updatedAt?: Date;
}