import teacherTimetableModel from "../teacher.timetable.model";
import ClassTimetable from "../../Student/timetable.model";
export class TeacherTimetableRepo {
  static async getTimetable(userId: string) {
    return await teacherTimetableModel.findOne({ teacherId: userId });
  }
  static async getClassTimetable(classId: string) {
    const data = await ClassTimetable.findOne({ classId: classId });
    return data;
  }
}
