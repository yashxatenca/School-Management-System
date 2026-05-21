import { Types } from 'mongoose';
import { TeacherClassRepo } from './class.teacher.repo';
import { IClass } from '../global.class.interface';
import ApiErrors = require('../../../core/errors/ApiErrors');
import TeacherAuthModel from '../../auth/Teacher/models/teacher.auth.model';
//import { School } from '../../../school/admin.school.model'

export class TeacherClassService {
    // static async createClass(payload: Partial<IClass>, authId?: string) {
    //     if (!payload || Object.keys(payload).length === 0) {
    //         throw new ApiErrors.ApiError(400, "Payload cannot be empty");
    //     }

    //     const schoolid = await School.findOne({ authId })
    //     if (!schoolid) {
    //         throw new ApiErrors.ApiError(404, "School not found");
    //     }

    //     payload.schoolId = schoolid._id;
    //     const user = await AdminClassRepo.createClass(payload);
    //     return user;
    // }

    static async findClassById(classId: Types.ObjectId) {
        const classData = await TeacherClassRepo.findClassById(classId);
        if (!classData) {
            throw new ApiErrors.ApiError(404, "Class not found");
        }
        return classData;
    }

    // static async updateClass(classId: Types.ObjectId, payload: Partial<IClass>) {
    //     const updatedClass = await AdminClassRepo.updateClass(classId, payload);
    //     if (!updatedClass) {
    //         throw new ApiErrors.ApiError(404, "Unable to update: Class not found");
    //     }
    //     return updatedClass;
    // }

    // static async deleteClass(classId: Types.ObjectId) {
    //     const deletedClass = await AdminClassRepo.deleteClass(classId);
    //     if (!deletedClass) {
    //         throw new ApiErrors.ApiError(404, "Unable to delete: Class not found");
    //     }
    //     return deletedClass;
    // }

    static async getAllClasses(id: string) {
        if (!id) {
            throw new ApiErrors.ApiError(404, "Teacher not found");
        }
        const classes = await TeacherClassRepo.getAllClasses(id);
        return classes;
    }
}