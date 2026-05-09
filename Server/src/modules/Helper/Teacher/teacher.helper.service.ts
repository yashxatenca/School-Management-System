import { ApiError } from "../../../core/errors/ApiErrors";
import { TeacherHelperRepo } from "./teacher.helper.repo";
export class TeacherHelperService {

    static async getClassandStudentCountService(Id: string) {
        if (!Id) {
            throw new ApiError(400, "Credentials Required");
        }

        const ClassData = await TeacherHelperRepo.getClassAndTotalStudentByTeacherId(Id)
        if (!ClassData) throw new ApiError(400, "Document Not Found")
        return ClassData;
    }
}