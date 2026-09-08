import { Types, Document } from 'mongoose';

export interface IHomework extends Document {
    title: string;
    description: string;
    classId: Types.ObjectId | string;
    subjectId: Types.ObjectId | string;
    assignedById: Types.ObjectId | any; 
    assignedUser: 'TeacherAuth' | 'Admin'; 
    hasDueDate: boolean;
    dueDate?: Date;
    attachments: string[];
    isDeleted: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
