import mongoose, { Schema, Document } from 'mongoose';

export interface IExam extends Document {
    name: string;           // e.g., "Half-Yearly Examination", "Unit Test 1"
    examType: string;       // e.g., "Mid-Term", "Final", "Weekly"
    academicYear: string;   // e.g., "2025-2026"
    startDate: Date;
    endDate: Date;
    principal: mongoose.Types.ObjectId;
    classesAssigned: mongoose.Types.ObjectId[]; // Kin classes ke liye ye exam hai
    status: 'Upcoming' | 'Ongoing' | 'Completed' | 'Results_Declared';
    description?: string;
}