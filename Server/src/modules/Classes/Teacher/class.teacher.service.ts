import { Types } from 'mongoose';
import { TeacherClassRepo } from './class.teacher.repo';
import { IClass } from '../global.class.interface';
import ApiErrors = require('../../../core/errors/ApiErrors');
import TeacherAuthModel from '../../auth/Teacher/models/teacher.auth.model';
//import { School } from '../../../school/admin.school.model'

export class TeacherClassService {
  
    static async findClassById(classId: Types.ObjectId) {
        const classData = await TeacherClassRepo.findClassById(classId);
        if (!classData) {
            throw new ApiErrors.ApiError(404, "Class not found");
        }
        return classData;
    }

 
    static async getAllClasses(id: string) {
        if (!id) {
            throw new ApiErrors.ApiError(404, "Teacher not found");
        }
        const classes = await TeacherClassRepo.getAllClasses(id);
        return classes;
    }
}