import { IExam } from "../exam.interface";
import { Types } from "mongoose";
import Exam from "../exam.model";

export class ExamRepo {
    static async createExamRepo(payload: IExam) {
        return await Exam.create(payload)
    }

    static async getAllExamRepo(id: string) {
        const user = await Exam.find({ principal: id })
        return user
    }

    static async getExamByIdRepo(id: string) {
        return await Exam.findById(id)
    }

    static async updateExamRepo(id: string, payload: IExam) {
        return await Exam.findByIdAndUpdate(id, payload, { new: true })
    }

    static async deleteExamRepo(id: string) {
        return await Exam.findByIdAndDelete(id)
    }

}