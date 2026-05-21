import { ApiError } from "../../../core/errors/ApiErrors";
import { School } from "../../school/admin.school.model";
import { SubjectModel } from "../global.subject.model";
export class TeacherSubjectRepo {
    static async getAllSubject(principalId: string) {
        const school = await School.findOne({ authId: principalId });
        if (!school) {
            throw new ApiError(404, "School not found")
        }
        const subjects = await SubjectModel.find({ schoolId: school._id });
        return subjects;

    }
}