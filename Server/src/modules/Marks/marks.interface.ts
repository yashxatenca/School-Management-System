import mongoose, { Schema, Document } from 'mongoose';

export interface IMark extends Document {
    examId: mongoose.Types.ObjectId;
    studentId: mongoose.Types.ObjectId;
    classId: mongoose.Types.ObjectId;
    teacherId: mongoose.Types.ObjectId;
    principalId: mongoose.Types.ObjectId;
    subjects: {
        subjectId: mongoose.Types.ObjectId; // Or subjectId if you have a separate Subject model
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