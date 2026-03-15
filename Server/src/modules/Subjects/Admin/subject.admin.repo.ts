import { SubjectModel } from '../global.subject.model';
import { ISubject } from '../global.interface';
import { Types } from 'mongoose';

export class SubjectRepo {
    static async createSubject(payload: ISubject) {
        return await SubjectModel.create(payload);
    }

    static async findSubjectById(subjectId: Types.ObjectId) {
        return await SubjectModel.findById(subjectId);
    }

    static async findbySubjectCode(code: string) {
        return await SubjectModel.findOne({ code })

    }

    static async updateSubject(subjectId: Types.ObjectId, payload: Partial<ISubject>) {
        return await SubjectModel.findByIdAndUpdate(subjectId, payload, { returnDocument: "after", runValidators: true });
    }

    static async deleteSubject(subjectId: Types.ObjectId) {
        return await SubjectModel.findByIdAndDelete(subjectId);
    }

    static async getAllSubjects() {
        return await SubjectModel.find();
    }
}