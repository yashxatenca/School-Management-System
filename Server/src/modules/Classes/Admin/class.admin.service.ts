import { Types } from 'mongoose';
import { AdminClassRepo } from './class.admin.repo';
import { IClass } from '../global.class.interface';
import ApiErrors = require('../../../core/errors/ApiErrors');

export class AdminClassService {
    static async createClass(payload: Partial<IClass>) {
        if (!payload || Object.keys(payload).length === 0) {
            throw new ApiErrors.ApiError(400, "Payload cannot be empty");
        }
        return await AdminClassRepo.createClass(payload);
    }

    static async findClassById(classId: Types.ObjectId) {
        const classData = await AdminClassRepo.findClassById(classId);
        if (!classData) {
            throw new ApiErrors.ApiError(404, "Class not found");
        }
        return classData;
    }

    static async updateClass(classId: Types.ObjectId, payload: Partial<IClass>) {
        const updatedClass = await AdminClassRepo.updateClass(classId, payload);
        if (!updatedClass) {
            throw new ApiErrors.ApiError(404, "Unable to update: Class not found");
        }
        return updatedClass;
    }

    static async deleteClass(classId: Types.ObjectId) {
        const deletedClass = await AdminClassRepo.deleteClass(classId);
        if (!deletedClass) {
            throw new ApiErrors.ApiError(404, "Unable to delete: Class not found");
        }
        return deletedClass;
    }

    static async getAllClasses() {
        return await AdminClassRepo.getAllClasses();
    }
}