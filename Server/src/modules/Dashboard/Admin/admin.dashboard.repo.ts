import TeacherAuthModel from "../../auth/Teacher/models/teacher.auth.model";
import { StudentAuth } from "../../auth/Student/models/student.auth.model";
import { ClassModel } from "../../Classes/global.class.model";
import { ObjectId } from "mongoose";
export class AdminDashboardRepo {
  static async getDashboard(principalId: string) {
    const [totalTeachers, totalStudents, sectionsCount, classes] =
      await Promise.all([
        TeacherAuthModel.countDocuments({ principalId }),
        StudentAuth.countDocuments({ principalId: principalId }),
        ClassModel.countDocuments({ createdBy: principalId }),
        ClassModel.distinct("name", { createdBy: principalId }),
      ]);
        
    return {
      totalTeachers,
      totalStudents,
      totalClasses: classes.length,
      totalSections: sectionsCount,
    };
  }
}
