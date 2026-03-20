import { Schema, model } from 'mongoose';
import { SubjectAssignmentDocument } from './assignsubject.interface';

const subjectAssignmentSchema = new Schema<SubjectAssignmentDocument>(
    {
        teacherId: { type: Schema.Types.ObjectId, ref: 'TeacherAuth', required: true },
        subjectId: { type: Schema.Types.ObjectId, ref: 'Subject', required: true },
        assignedBy: { type: Schema.Types.ObjectId, ref: 'Admin', required: true },
        academicYear: { type: String, required: true, trim: true },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true, versionKey: false }
);

// Prevent assigning the same subject to the same teacher twice in one year
subjectAssignmentSchema.index({ teacherId: 1, subjectId: 1, academicYear: 1 }, { unique: true });

export const SubjectAssignmentModel = model<SubjectAssignmentDocument>('SubjectAssignment', subjectAssignmentSchema);