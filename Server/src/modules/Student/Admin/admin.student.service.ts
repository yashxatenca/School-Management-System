import { AdminStudentRepo } from "./admin.student.repo";
import { StudentAuthDocument } from "../../auth/Student/interface/student.auth.interface";
import { ApiError } from "../../../core/errors/ApiErrors";
import { StudentService } from "../../auth/Student/service/student.auth.service";

export class AdminStudentService {
  static async createstudentservice(data: StudentAuthDocument) {
    if (!data) {
      throw new ApiError(404, "All details are Required");
    }
    if (!data.schoolId || !data.classId || !data.teacherId) {
      throw new ApiError(404, "All Teacher, School,Class Details are Required");
    }

    const user = await StudentService.registerStudent(data);
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
}
