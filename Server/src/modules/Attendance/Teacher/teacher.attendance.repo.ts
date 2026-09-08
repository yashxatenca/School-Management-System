import { Types } from "mongoose";
import { AttendanceModel } from "../attendance.model";
import { AttendanceRecordDTO, IAttendance } from "../attendance.interface";

export class TeacherAttendanceRepository {

  async bulkUpsert(
    classId: string,
    normalizedDate: Date,
    records: AttendanceRecordDTO[],
    teacherId: string,
  ): Promise<void> {
    const bulkOps = records.map((record) => ({
      updateOne: {
        filter: {
          studentId: new Types.ObjectId(record.studentId),
          date: normalizedDate,
        },
        update: {
          $set: {
            class: new Types.ObjectId(classId),
            status: record.status,
            remarks: record.remarks || "",
            markedBy: new Types.ObjectId(teacherId),
          },
        },
        upsert: true,
      },
    }));

    await AttendanceModel.bulkWrite(bulkOps);
  }

  async findByClassAndDate(
    classId: string,
    date: Date,
  ): Promise<IAttendance[]> {
    return AttendanceModel.find({ class: new Types.ObjectId(classId), date })
      .populate("studentId", "name studentId email")
      .lean();
  }

  async deleteById(attendanceId: string) {
    return AttendanceModel.findByIdAndDelete(attendanceId);
  }
}
