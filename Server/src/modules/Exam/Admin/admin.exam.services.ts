import { ExamRepo } from "./admin.exam.repo";
import { IExam } from "../exam.interface";
import { ApiError } from "../../../core/errors/ApiErrors";

export class ExamService {
    static async createExamService(payload: IExam) {
        if (!payload.name || !payload.examType || !payload.academicYear || !payload.startDate || !payload.endDate) {
            throw new ApiError(402, "All fields are required")
        }
        return await ExamRepo.createExamRepo(payload)
    }

    static async getAllExamService(id: string) {

        if (!id) {
            throw new ApiError(402, "Principal id is required")
        }

        return await ExamRepo.getAllExamRepo(id)
    }

    static async getExamByIdService(id: string) {
        if (!id) {
            throw new ApiError(402, "Exam id is required")
        }
        return await ExamRepo.getExamByIdRepo(id)
    }

    static async updateExamService(id: string, payload: IExam) {
        if (!id || !payload) {
            throw new ApiError(402, "All details are required")
        }
        return await ExamRepo.updateExamRepo(id, payload)
    }

    static async deleteExamService(id: string) {
        if (!id) {
            throw new ApiError(402, "Exam id is required")
        }
        return await ExamRepo.deleteExamRepo(id)
    }
}