import { IHomework } from "../homework.interface";
import { Homework } from "../homework.model";
import { ApiError } from "../../../core/errors/ApiErrors";

export class TeacherHomeworkRepo {
    static async createHomework(data: IHomework) {
        if (!data) {
            throw new ApiError(400, "Please provide homework data");
        }
        return await Homework.create(data);
    }
    static async getHomeworkByClassId(classId: string, teacherId: string) {
        if (!classId || !teacherId) {
            throw new ApiError(400, "Provide all details ");
        }
        return await Homework.find({ classId: classId, assignedById: teacherId });
    }

}