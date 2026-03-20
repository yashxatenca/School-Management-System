import { Types, Document } from 'mongoose';

// 1. The base data structure
export interface ClassAssignment {
    classId: Types.ObjectId;
    teacherId: Types.ObjectId;
    assignedBy: Types.ObjectId; // Stores the Admin's ID
    academicYear: string;       // e.g., "2025" or "2025-2026"
    isActive: boolean;          // Essential for CRUD: allows you to "archive" old assignments instead of deleting them
}

// 2. The Mongoose Document interface (Includes auto-generated dates)
export interface ClassAssignmentDocument extends ClassAssignment, Document {
    createdAt: Date;
    updatedAt: Date;
}