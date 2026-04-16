import mongoose, { Schema, Document } from 'mongoose';

export interface IMark extends Document {
    examId: mongoose.Types.ObjectId;
    studentId: mongoose.Types.ObjectId;
    classId: mongoose.Types.ObjectId; // Useful for fetching all marks for a specific class easily
    subjects: {
        subjectName: string; // Or subjectId if you have a separate Subject model
        maxMarks: number;
        passingMarks: number;
        obtainedMarks: number;
        grade?: string;
        remarks?: string;
    }[];
    totalMaxMarks: number;
    totalObtainedMarks: number;
    percentage: number;
    overallGrade: string;
    resultStatus: 'Pass' | 'Fail' | 'Promoted' | 'Withheld';
    remarks?: string;
}