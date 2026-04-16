// 1. TypeScript Interface for type safety
import { Document } from "mongoose";
export interface IResult extends Document {
    studentId: mongoose.Types.ObjectId;
    classId: mongoose.Types.ObjectId;
    subjectId: mongoose.Types.ObjectId;
    examId: mongoose.Types.ObjectId; // Links to a specific exam event (e.g., "Term 1 Finals")
    academicYear: string;            // e.g., "2025-2026"

    marks: {
        theoryObtained: number;
        practicalObtained?: number;    // Optional, as not all subjects have practicals
        totalObtained: number;
        maxTotalMarks: number;
    };

    grade: string;
    isPass: boolean;
    remarks?: string;

    gradedBy: mongoose.Types.ObjectId; // Formerly your 'teacherId'
}
