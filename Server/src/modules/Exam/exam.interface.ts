import mongoose, { Schema, Document } from 'mongoose';

export interface IExam extends Document {
    name: string;           
    examType: string;       
    academicYear: string;   
    startDate: Date;
    endDate: Date;
    principal: mongoose.Types.ObjectId;
    classesAssigned: mongoose.Types.ObjectId[]; // Kin classes ke liye ye exam hai
    status: 'Upcoming' | 'Ongoing' | 'Completed' | 'Results_Declared';
    description?: string;
}