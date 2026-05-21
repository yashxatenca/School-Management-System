import { ApiError } from '../../../core/errors/ApiErrors';
import { classassignmodel } from '../class-subject-assign.interface';
import { ClassSubjectAssign } from '../class-subject-assign.model';

export class ClassAssignTeacherRepo {
    static async create(data: Partial<classassignmodel>) {
        if (!data) {
            throw new ApiError(400, "Please Provide the Details");
        }
        return await ClassSubjectAssign.create(data);
    }

    static async read(filter: any = {}) {
        // Populating references so you get actual data, not just ObjectIds
        return await ClassSubjectAssign.find(filter)
            .populate('classId')
            .populate('subjectId')
            .populate('classTeacherId');
    }

    static async update(id: string, data: Partial<classassignmodel>) {
        const updatedAssign = await ClassSubjectAssign.findByIdAndUpdate(
            id,
            data,
            { new: true, runValidators: true }
        );

        if (!updatedAssign) {
            throw new ApiError(404, "Assignment not found");
        }
        return updatedAssign;
    }

    static async delete(id: string) {
        const deletedAssign = await ClassSubjectAssign.findByIdAndDelete(id);

        if (!deletedAssign) {
            throw new ApiError(404, "Assignment not found");
        }
        return deletedAssign;
    }
}