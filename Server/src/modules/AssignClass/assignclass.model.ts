import { Schema, model } from 'mongoose';
import { ClassAssignmentDocument } from './assignclass.interface';

const classAssignmentSchema = new Schema<ClassAssignmentDocument>(
    {
        // Removed unique: true so we can keep historical (inactive) records
        classId: { type: Schema.Types.ObjectId, ref: 'Class', required: true },
        teacherId: { type: Schema.Types.ObjectId, ref: 'TeacherAuth', required: true },
        assignedBy: { type: Schema.Types.ObjectId, ref: 'Admin', required: true },
        academicYear: { type: String, required: true, trim: true }, // REMOVED unique: true
        isActive: { type: Boolean, default: true },
    },
    {
        timestamps: true,
        versionKey: false
    }
);

// This index prevents the EXACT same assignment from happening twice
classAssignmentSchema.index({ classId: 1, teacherId: 1, academicYear: 1 }, { unique: true });

export const ClassAssignmentModel = model<ClassAssignmentDocument>('ClassAssignment', classAssignmentSchema);