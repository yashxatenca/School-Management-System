import { Types } from 'mongoose';
import { ClassModel } from './class.model';
import { IClass } from '../global.class.interface';

export class AdminClassRepo {
    static async createClass(payload: Partial<IClass>) {
        return await ClassModel.create(payload);
    }

    static async findClassById(classId: Types.ObjectId) {
        return await ClassModel.findById(classId);
    }

    static async updateClass(classId: Types.ObjectId, payload: Partial<IClass>) {
        // { new: true } ensures Mongoose returns the updated document, not the old one
        return await ClassModel.findByIdAndUpdate(classId, payload, { returnDocument: "after", runValidators: true });
    }

    static async deleteClass(classId: Types.ObjectId) {
        return await ClassModel.findByIdAndDelete(classId);
    }

    static async getAllClasses() {
        return await ClassModel.find({}).sort({ createdAt: -1 });
    }
}