import mongoose, { Schema, Document } from 'mongoose';
import { IHomework } from './homework.interface';


const HomeworkSchema = new Schema<IHomework>(
    {
        title: { type: String, required: true, trim: true },
        description: { type: String, required: true },
        classId: { type: Schema.Types.ObjectId, ref: 'Class', required: true },
        subjectId: { type: Schema.Types.ObjectId, ref: 'Subject', required: true },

        // 1. Fixed the typo: assignedUser vs assingedUser
        assignedById: {
            type: Schema.Types.ObjectId,
            required: true,
            refPath: "assignedUser"
        },
        assignedUser: { // Match this to refPath
            type: String,
            required: true,
            enum: ["TeacherAuth", "Admin"],
        },

        hasDueDate: { type: Boolean, default: true },
        dueDate: {
            type: Date,
            required: function () { return this.hasDueDate === true; }
        },
        attachments: [{ type: String }],
        isDeleted: { type: Boolean, default: false },
    },
    { timestamps: true }
);


export const Homework = mongoose.models.Homework || mongoose.model<IHomework>('Homework', HomeworkSchema);