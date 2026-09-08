import { Types } from 'mongoose';
import { ClassModel } from '../global.class.model';
import { IClass } from '../global.class.interface';
import { School } from '../../school/admin.school.model';

export class TeacherClassRepo {
    static async createClass(payload: Partial<IClass>) {
        return await ClassModel.create(payload);
    }

    static async findClassById(classId: Types.ObjectId) {
        return await ClassModel.findById(classId);
    }

    static async updateClass(classId: Types.ObjectId, payload: Partial<IClass>) {
      
        return await ClassModel.findByIdAndUpdate(classId, payload, { returnDocument: "after", runValidators: true });
    }

    static async deleteClass(classId: Types.ObjectId) {
        return await ClassModel.findByIdAndDelete(classId);
    }

    static async getAllClasses(principalId: string) {
        const school = await School.findOne({ authId: new Types.ObjectId(principalId) });
        if (!school) {
            throw new Error("School not found");
        }
        return await ClassModel.find({ schoolId: school._id }).sort({ createdAt: -1 })
    }
}