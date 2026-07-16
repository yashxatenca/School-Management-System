import StudentTimetableModel from "../timetable.model";
export class StudentTimetableRepo {
  static async getTimetable(classId: string) {
    return await StudentTimetableModel.find({ classId });
  }
}
