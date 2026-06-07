import { Types } from "mongoose";
import { Attendance } from "../attendance.model"; // Apne model file ka path dein

export class AttendanceRepository {
  // Common aggregation pipeline logic
  private getStudentAggregationPipeline(matchStage: any, studentId: string) {
    return [
      { $match: matchStage },
      { $unwind: "$attendance" },
      { $match: { "attendance.studentId": new Types.ObjectId(studentId) } },
      {
        $lookup: {
          from: "studentauths", // Database mein apna actual student collection name check kar lein
          localField: "attendance.studentId",
          foreignField: "_id",
          as: "studentInfo",
        },
      },
      { $unwind: "$studentInfo" },
      {
        $project: {
          _id: 1,
          date: 1,
          status: "$attendance.status",
          remarks: "$attendance.remarks",
          studentId: {
            _id: "$studentInfo._id",
            name: "$studentInfo.name", // Assuming 'name' field is in your Student model
          },
        },
      },
      { $sort: { date: -1 } },
    ];
  }

  async findBySingleDate(studentId: string, date: string) {
    const matchStage = {
      date: date,
      "attendance.studentId": new Types.ObjectId(studentId),
    };
    return await Attendance.aggregate(
      this.getStudentAggregationPipeline(matchStage, studentId),
    );
  }

  async findByDateRange(studentId: string, startDate: string, endDate: string) {
    const matchStage = {
      date: { $gte: startDate, $lte: endDate }, // String format YYYY-MM-DD standard alphabetical sorting follow karta hai
      "attendance.studentId": new Types.ObjectId(studentId),
    };
    return await Attendance.aggregate(
      this.getStudentAggregationPipeline(matchStage, studentId),
    );
  }
}
