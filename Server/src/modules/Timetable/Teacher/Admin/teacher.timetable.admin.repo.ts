import { ApiError } from "../../../../core/errors/ApiErrors";
import { TeacherTimetableInterface } from "../teacher.timetable.interface";
import TeacherTimetable from "../teacher.timetable.model";

export class TeacherTimetableRepo {
  static async create(data: TeacherTimetableInterface) {
    if (!data) throw new ApiError(400, "Timetable data is required");
    return await TeacherTimetable.create(data);
  }

  static async findById(id: string) {
    if (!id) throw new ApiError(400, "Timetable ID is required");
    return await TeacherTimetable.findById(id).populate("classId");
  }

  static async findByTeacherId(teacherId: string) {
    if (!teacherId) throw new ApiError(400, "Class ID is required");
    return await TeacherTimetable.find({ teacherId }).populate("teacherId");
  }

  static async delete(id: string) {
    if (!id) throw new ApiError(400, "Timetable ID is required");

    const deletedTimetable = await TeacherTimetable.findByIdAndDelete(id);

    if (!deletedTimetable) throw new ApiError(404, "Timetable not found");
    return deletedTimetable;
  }
}
