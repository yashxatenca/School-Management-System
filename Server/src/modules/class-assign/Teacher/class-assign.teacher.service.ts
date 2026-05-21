import { ClassAssignTeacherRepo } from './class-assign.teacher.repo';
import { classassignmodel } from '../class-subject-assign.interface';
import { ApiError } from '../../../core/errors/ApiErrors';

export class ClassAssignTeacherService {
    static async createAssignment(data: Partial<classassignmodel>) {
        // Example of business logic validation:
        if (!data.classId || !data.subjectId || !data.classTeacherId) {
            throw new ApiError(400, "Class ID, Subject ID, and Class Teacher ID are required");
        }
        return await ClassAssignTeacherRepo.create(data);
    }

    static async getAllAssignments(filter: any = {}) {
        return await ClassAssignTeacherRepo.read(filter);
    }

    static async updateAssignment(id: string, data: Partial<classassignmodel>) {
        if (!id) throw new ApiError(400, "Assignment ID is required");
        return await ClassAssignTeacherRepo.update(id, data);
    }

    static async deleteAssignment(id: string) {
        if (!id) throw new ApiError(400, "Assignment ID is required");
        return await ClassAssignTeacherRepo.delete(id);
    }
}