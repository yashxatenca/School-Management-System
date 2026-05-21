import { IHomework } from "../homework.interface";
import { TeacherHomeworkRepo } from "./teacher.homework.repo";
import { ApiError } from "../../../core/errors/ApiErrors";

export class TeacherHomeworkService {
    static async createHomework(data: IHomework) {
        if (!data) {
            throw new ApiError(400, "Please provide homework data");
        }

        return await TeacherHomeworkRepo.createHomework(data);
    }

    static async getHomeworkByClassId(classId: string, teacherId: string) {
        if (!classId || !teacherId) {
            throw new ApiError(400, "Please provide all details");
        }
        return await TeacherHomeworkRepo.getHomeworkByClassId(classId, teacherId);
    }
}