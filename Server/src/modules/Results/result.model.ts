import mongoose, { Schema, Document } from 'mongoose';
import { IResult } from './result.interface';

// 2. Mongoose Schema
const ResultSchema: Schema = new Schema({
    studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
    classId: { type: Schema.Types.ObjectId, ref: 'Class', required: true },
    subjectId: { type: Schema.Types.ObjectId, ref: 'Subject', required: true },
    examId: { type: Schema.Types.ObjectId, ref: 'Exam', required: true },
    academicYear: { type: String, required: true },
    marks: {
        theoryObtained: { type: Number, required: true, min: 0 },
        practicalObtained: { type: Number, min: 0, default: 0 },
        totalObtained: { type: Number, required: true, min: 0 },
        maxTotalMarks: { type: Number, required: true, min: 1 }
    },

    grade: { type: String, required: true },
    isPass: { type: Boolean, required: true },
    remarks: { type: String, trim: true },

    gradedBy: { type: Schema.Types.ObjectId, ref: 'Teacher', required: true }
}, {
    timestamps: true // Automatically adds createdAt and updatedAt
});

// 3. Compound Index for fast queries and preventing duplicates
// This ensures a student cannot have two different result documents for the exact same exam and subject.
ResultSchema.index({ studentId: 1, subjectId: 1, examId: 1 }, { unique: true });

export default mongoose.model<IResult>('Result', ResultSchema);