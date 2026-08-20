import { Types } from "mongoose";
import { AttendanceModel } from "../attendance.model";

export class StudentAttendanceRepository {
  async findMyAttendance(studentId: string, startDate?: Date, endDate?: Date) {
    // 1. Corrected field name: 'studentId' instead of 'student'
    const filter: any = { studentId: new Types.ObjectId(studentId) };

    // 2. Date Range filter instead of exact date match
    if (startDate && endDate) {
      filter.date = { $gte: startDate, $lte: endDate };
    }

    // 3. Corrected populate field name: 'class' instead of 'classId'
    return AttendanceModel.find(filter)
      .populate("class", "name section")
      .populate("markedBy", "name")
      .sort({ date: -1 })
      .lean();
  }
}
