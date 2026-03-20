import { Types, Document } from 'mongoose';

export interface SubjectAssignment {
    teacherId: Types.ObjectId;
    subjectId: Types.ObjectId;
    assignedBy: Types.ObjectId;
    academicYear: string;
    isActive?: boolean;
}

export interface SubjectAssignmentDocument extends SubjectAssignment, Document {
    createdAt: Date;
    updatedAt: Date;
}