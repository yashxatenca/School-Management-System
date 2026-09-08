import { Types } from "mongoose";
import { AttendanceModel } from "../attendance.model";

export class StudentAttendanceRepository {
  async findMyAttendance(studentId: string, startDate?: Date, endDate?: Date) {
    
    const filter: any = { studentId: new Types.ObjectId(studentId) };

  
    if (startDate && endDate) {
      filter.date = { $gte: startDate, $lte: endDate };
    }

 
    return AttendanceModel.find(filter)
      .populate("class", "name section")
      .populate("markedBy", "name")
      .sort({ date: -1 })
      .lean();
  }
}
