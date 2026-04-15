import { adminHomeworkRepo } from './admin.homework.repo';
import { IHomework } from '../homework.interface';
import { ApiError } from '../../../core/errors/ApiErrors';

export class HomeworkService {

    async createHomework(data: Partial<IHomework>, role: string) {
        // Yahan tum extra business validation laga sakte ho
        if (!data.title || !data.classId || !data.subjectId) {
            throw new Error("Missing required fields!");
        }
        return await adminHomeworkRepo.create(data, role);
    }

    async fetchAllHomework(filters: { classId?: string; subjectId?: string }) {
        if (!filters.classId || !filters.subjectId) {
            throw new ApiError(400, "Missing required fields!");
        }
        return await adminHomeworkRepo.getAll(filters);
    }

    async fetchHomeworkById(id: string) {
        const homework = await adminHomeworkRepo.getById(id);
        if (!homework) {
            throw new Error("Homework not found or has been deleted.");
        }
        return homework;
    }

    async updateHomework(id: string, updateData: Partial<IHomework>) {
        const updated = await adminHomeworkRepo.update(id, updateData);
        if (!updated) {
            throw new Error("Homework update failed.");
        }
        return updated;
    }

    async deleteHomework(id: string) {
        const deleted = await adminHomeworkRepo.delete(id);
        if (!deleted) {
            throw new Error("Homework deletion failed.");
        }
        return { message: "Homework deleted successfully (7-day TTL started)" };
    }

    async getHomeworkbyIdsServices(id: string) {
        if (!id) {
            throw new ApiError(400, "Missing required fields!");
        }
        return await adminHomeworkRepo.gethomeworkbyids(id);
    }

}

export const homeworkService = new HomeworkService();