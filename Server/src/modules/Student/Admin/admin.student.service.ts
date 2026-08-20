import { AdminStudentRepo } from "./admin.student.repo";
import { StudentAuthDocument } from "../../auth/Student/interface/student.auth.interface";
import { ApiError } from "../../../core/errors/ApiErrors";
import { StudentService } from "../../auth/Student/service/student.auth.service";
import StudentProfileRepository from "../../profile/Student/student.profile.repo";
export class AdminStudentService {
  static async createstudentservice(data: StudentAuthDocument) {
    if (!data) {
      throw new ApiError(404, "All details are Required");
    }
    if (!data.schoolId || !data.classId || !data.teacherId) {
      throw new ApiError(404, "All Teacher, School,Class Details are Required");
    }

    const user = await StudentService.registerStudent(data);
    if (!user) throw new ApiError(400, "Unable to create student");
    await StudentProfileRepository.createProfile(user);

    return user;
  }
  static async getStudentByStudentIdService(id: string) {
    if (!id) {
      throw new ApiError(404, "Student Id is Required");
    }
    const user = await AdminStudentRepo.getStudentByStudentIdRepo(id);
    if (!user) {
      throw new ApiError(404, "Student Not Found");
    }
    return user;
  }
  static async getStudentByClassIdService(id: string) {
    if (!id) {
      throw new ApiError(404, "Class Id is Required");
    }
    const user = await AdminStudentRepo.getStudentByClassIdRepo(id);
    if (!user) {
      throw new ApiError(404, "Student Not Found");
    }
    return user;
  }
  static async deleteStudentService(id: string) {
    if (!id) {
      throw new ApiError(404, "Student Id is Required");
    }
    const user = await AdminStudentRepo.deleteStudentById(id);
    if (!user) {
      throw new ApiError(404, "Student Not Found");
    }
    return user;
  }
  static async updateStudentByStudentIdService(
    id: string,
    data: StudentAuthDocument,
  ) {
    if (!id) {
      throw new ApiError(404, "Student Id is Required");
    }
    const user = await AdminStudentRepo.updateStudentByStudentIdRepo(id, data);
    if (!user) {
      throw new ApiError(404, "Student Not Found");
    }
    return user;
  }
  static async bulkUpdateStudents(data: any) {
    const { studentIds, classId, teacherId } = data;

    // 1. Validation checks
    if (!Array.isArray(studentIds) || studentIds.length === 0) {
      throw new Error("Please provide a non-empty array of student IDs.");
    }

    if (!classId && !teacherId) {
      throw new Error("Please provide either a target classId or teacherId.");
    }

    // 2. Prepare payload
    const updatePayload: { classId?: string; teacherId?: string } = {};
    if (classId) updatePayload.classId = classId;
    if (teacherId) updatePayload.teacherId = teacherId;

    // 3. Execute DB operation via Repository
    const result = await AdminStudentRepo.bulkUpdateWithIds(
      studentIds,
      updatePayload,
    );

    return {
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount,
    };
  }
}
