import { ApiError } from "../../../core/errors/ApiErrors";
import { ISchoolProfile } from "../school.global.interface";
import { SchoolRepo } from './admin.school.repo'
export class AdminSchoolService {
    static async GetSchoolDetails(id: string) {
        if (!id) {
            throw new ApiError("School ID is required", 400)
        }
        const school = await SchoolRepo.getSchool(id);

        if (!school) {
            throw new ApiError("School not found", 404)
        }
        return school;
    }

    static async UpdateSchoolProfile(id: string, data: Partial<ISchoolProfile>) {
        if (!id) {
            throw new ApiError("School ID is required", 400)
        }
        const school = await SchoolRepo.updateSchool(id, data);
        if (!school) {
            throw new ApiError("School not found", 404)
        }
        return school ? true : false;
    }
    static async GetSchoolbyauthid(id: string) {
        if (!id) {
            throw new ApiError("School ID is required", 400)
        }
        const school = await SchoolRepo.getschoolbyauthid(id);
        if (!school) {
            throw new ApiError("School not found", 404)
        }
        return school._id.toString();
    }
}