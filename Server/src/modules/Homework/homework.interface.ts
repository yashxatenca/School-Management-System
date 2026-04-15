import { Types, Document } from 'mongoose';

export interface IHomework extends Document {
    title: string;
    description: string;
    classId: Types.ObjectId | string;
    subjectId: Types.ObjectId | string;
    assignedById: Types.ObjectId | any; // Use 'any' if you plan to .populate() this
    assignedUser: 'TeacherAuth' | 'Admin'; // This tells Mongoose which model to use
    hasDueDate: boolean;
    dueDate?: Date;
    attachments: string[];
    isDeleted: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
