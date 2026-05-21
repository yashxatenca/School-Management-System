import { ApiError } from "../../../core/errors/ApiErrors";
import { TeacherSubjectRepo } from "./subject.teacher.repo";

export class TeacherSubjectService {
    static async getAllSubject(principalId: string) {
        if (!principalId) throw new ApiError(400, "Details are required");
        return await TeacherSubjectRepo.getAllSubject(principalId);
    }
}