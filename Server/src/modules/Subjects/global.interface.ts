import { Types } from "mongoose";

export interface ISubject {
    _id?: Types.ObjectId;

    name: string;
    code: string;

    schoolId: Types.ObjectId;

    description?: string;

    isActive: boolean;

    createdBy?: Types.ObjectId;
    updatedBy?: Types.ObjectId;

    createdAt?: Date;
    updatedAt?: Date;
}