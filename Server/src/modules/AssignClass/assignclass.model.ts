import { Schema, model } from 'mongoose';
import { ClassAssignmentDocument } from './assignclass.interface';

const classAssignmentSchema = new Schema<ClassAssignmentDocument>(
    {
        classId: { type: Schema.Types.ObjectId, ref: 'Class', required: true },
        teacherId: { type: Schema.Types.ObjectId, ref: 'TeacherAuth', required: true },
        assignedBy: { type: Schema.Types.ObjectId, ref: 'Admin', required: true }, // The Admin
        academicYear: { type: String, required: true, trim: true },
        isActive: { type: Boolean, default: true },
    },
    {
        timestamps: true,
        versionKey: false // Removes the __v field for cleaner data
    }
);

// Optional: Add an index so we can't accidentally assign the same teacher to the same class twice in one year
classAssignmentSchema.index({ classId: 1, teacherId: 1, academicYear: 1 }, { unique: true });

export const ClassAssignmentModel = model<ClassAssignmentDocument>('ClassAssignment', classAssignmentSchema);