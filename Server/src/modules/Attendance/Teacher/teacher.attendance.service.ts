import { ApiError } from "../../../core/errors/ApiErrors";
import { TeacherHelperRepo } from "../../Helper/Teacher/teacher.helper.repo";
export class AttendanceTeacherService {
    static async getStudents(teacherId: string) {
        if (!teacherId) {
            throw new ApiError(402, "Details are required");
        }
        try {
            const classId = await TeacherHelperRepo.getClassIdwithTeacherId(teacherId);
            if (!classId) {
                throw new ApiError(404, "Class not found");
            }
            const students = await TeacherHelperRepo.getStudentByClassId(classId._id.toString());
            if (!students) {
                throw new ApiError(404, "Students not found");
            }
            return students;
        } catch (error) {
            throw error;
        }


    }

}