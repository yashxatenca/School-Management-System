import { SubjectRepo } from "./subject.admin.repo";
import { Types } from "mongoose";
import { ISubject } from "../global.interface";
import { School } from "../../school/admin.school.model";
import { ApiError } from "../../../core/errors/ApiErrors";

export class SubjectService {
    static async createSubject(payload: ISubject, authId?: string) {
        const subject = await SubjectRepo.findbySubjectCode(payload.code as string);
        if (subject) {
            throw new ApiError(403, "Subject already exists");
        }

        const schoolId = await School.findOne({ authId })
        if (!schoolId) {
            throw new ApiError(404, "School not found");
        }
        payload.schoolId = schoolId._id;

        return await SubjectRepo.createSubject(payload);
    }

    static async findSubjectById(subjectId: Types.ObjectId) {
        return await SubjectRepo.findSubjectById(subjectId);
    }

    static async updateSubject(subjectId: Types.ObjectId, payload: Partial<ISubject>) {
        const subject = await SubjectRepo.findSubjectById(subjectId);
        if (!subject) {
            throw new ApiError(404, "Subject not found");
        }
        return await SubjectRepo.updateSubject(subjectId, payload);
    }

    static async deleteSubject(subjectId: Types.ObjectId) {
        return await SubjectRepo.deleteSubject(subjectId);
    }

    static async getAllSubjects() {
        return await SubjectRepo.getAllSubjects();
    }
}