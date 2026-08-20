import { Types } from "mongoose";
import { AttendanceModel } from "../attendance.model";

export class AdminAttendanceRepository {
  // Fixed field name 'studentId' instead of 'student'
  async findByStudentId(studentId: string, date?: Date) {
    const filter: any = { studentId: new Types.ObjectId(studentId) };

    if (date) {
      const start = new Date(date);
      start.setUTCHours(0, 0, 0, 0);
      const end = new Date(date);
      end.setUTCHours(23, 59, 59, 999);
      filter.date = { $gte: start, $lte: end };
    }

    return AttendanceModel.find(filter)
      .populate("class", "name section className")
      .populate("markedBy", "name email")
      .sort({ date: -1 })
      .lean();
  }

  // Uses full UTC day range for accurate date matching
  async findByClassAndDate(classId: string, date: Date) {
    const start = new Date(date);
    start.setUTCHours(0, 0, 0, 0);

    const end = new Date(date);
    end.setUTCHours(23, 59, 59, 999);

    return AttendanceModel.find({
      class: new Types.ObjectId(classId),
      date: { $gte: start, $lte: end },
    })
      .populate("studentId", "name rollNumber email") // Schema field is studentId
      .populate("markedBy", "name")
      .lean();
  }

  // Aggregation for Date Cards Summary
  async getMarkedDatesCards(classId: string, startDate: Date, endDate: Date) {
    return AttendanceModel.aggregate([
      {
        $match: {
          class: new Types.ObjectId(classId),
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          totalMarked: { $sum: 1 },
          presentCount: {
            $sum: { $cond: [{ $eq: ["$status", "PRESENT"] }, 1, 0] },
          },
          absentCount: {
            $sum: { $cond: [{ $eq: ["$status", "ABSENT"] }, 1, 0] },
          },
          lateCount: {
            $sum: { $cond: [{ $eq: ["$status", "LATE"] }, 1, 0] },
          },
          excusedCount: {
            $sum: { $cond: [{ $eq: ["$status", "EXCUSED"] }, 1, 0] },
          },
        },
      },
      { $sort: { _id: 1 } },
    ]);
  }
}
