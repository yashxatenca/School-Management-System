import { SubjectRepo } from "./subject.admin.repo";
import { Types } from "mongoose";
import { ISubject } from "../global.interface";

export class SubjectService {
    static async createSubject(payload: ISubject) {
        const subject = await SubjectRepo.findbySubjectCode(payload.code as string);
        if (subject) {
            throw new Error("Subject already exists");
        }
        return await SubjectRepo.createSubject(payload);
    }

    static async findSubjectById(subjectId: Types.ObjectId) {
        return await SubjectRepo.findSubjectById(subjectId);
    }

    static async updateSubject(subjectId: Types.ObjectId, payload: Partial<ISubject>) {
        return await SubjectRepo.updateSubject(subjectId, payload);
    }

    static async deleteSubject(subjectId: Types.ObjectId) {
        return await SubjectRepo.deleteSubject(subjectId);
    }

    static async getAllSubjects() {
        return await SubjectRepo.getAllSubjects();
    }
}