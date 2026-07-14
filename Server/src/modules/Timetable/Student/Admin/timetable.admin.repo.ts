import { ApiError } from "../../../../core/errors/ApiErrors";
import { ITimetable } from "../timetable.interface";
import StudentTimeTable from "../timetable.model";

export class StudentTimetableRepo {
  static async create(data: ITimetable) {
    if (!data) throw new ApiError(400, "Timetable data is required");
    return await StudentTimeTable.create(data);
  }

  static async findById(id: string) {
    if (!id) throw new ApiError(400, "Timetable ID is required");
    return await StudentTimeTable.findById(id).populate("classId");
  }

  static async findByClassId(classId: string) {
    if (!classId) throw new ApiError(400, "Class ID is required");
    return await StudentTimeTable.find({ classId }).populate("classId");
  }

  static async update(id: string, data: Partial<ITimetable>) {
    if (!id) throw new ApiError(400, "Timetable ID is required");
    if (!data || Object.keys(data).length === 0)
      throw new ApiError(400, "Update data is required");

    const updatedTimetable = await StudentTimeTable.findByIdAndUpdate(
      id,
      data,
      { new: true, runValidators: true },
    ).populate("classId");

    if (!updatedTimetable) throw new ApiError(404, "Timetable not found");
    return updatedTimetable;
  }

  static async delete(id: string) {
    if (!id) throw new ApiError(400, "Timetable ID is required");

    const deletedTimetable = await StudentTimeTable.findByIdAndDelete(id);

    if (!deletedTimetable) throw new ApiError(404, "Timetable not found");
    return deletedTimetable;
  }
}
